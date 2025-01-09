import { useState, useRef } from 'react';
import { Mic, Square, Play, Pause } from 'lucide-react';
import { Button } from '../ui/Button';
import { transcribeAudio } from '@/lib/openai';
import { toast } from 'react-hot-toast';

interface VoiceRecorderProps {
  onRecordingComplete: (blob: Blob, transcript: string) => void;
}

export function VoiceRecorder({ onRecordingComplete }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const recognition = useRef<SpeechRecognition | null>(null);
  const transcript = useRef<string>('');

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      
      mediaRecorder.current.ondataavailable = (e) => {
        chunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = async () => {
        const blob = new Blob(chunks.current, { type: 'audio/webm' });
        setIsTranscribing(true);
        try {
          const transcription = await transcribeAudio(blob);
          onRecordingComplete(blob, transcription);
          toast.success('Audio transcribed successfully');
        } catch (error) {
          toast.error('Failed to transcribe audio');
          onRecordingComplete(blob, '');
        } finally {
          setIsTranscribing(false);
          chunks.current = [];
        }
        transcript.current = '';
      };

      // Setup speech recognition
      if ('webkitSpeechRecognition' in window) {
        recognition.current = new webkitSpeechRecognition();
        recognition.current.continuous = true;
        recognition.current.interimResults = true;
        
        recognition.current.onresult = (event) => {
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              transcript.current += event.results[i][0].transcript + ' ';
            }
          }
        };
        
        recognition.current.start();
      }

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      recognition.current?.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const togglePause = () => {
    if (mediaRecorder.current && isRecording) {
      if (isPaused) {
        mediaRecorder.current.resume();
        recognition.current?.start();
      } else {
        mediaRecorder.current.pause();
        recognition.current?.stop();
      }
      setIsPaused(!isPaused);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center space-x-4">
        {!isRecording ? (
          <Button onClick={startRecording} variant="default" size="lg">
            <Mic className="mr-2 h-4 w-4" />
            Start Recording
          </Button>
        ) : (
          <>
            <Button onClick={togglePause} variant="outline" size="lg">
              {isPaused ? (
                <Play className="mr-2 h-4 w-4" />
              ) : (
                <Pause className="mr-2 h-4 w-4" />
              )}
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
            <Button onClick={stopRecording} variant="destructive" size="lg">
              <Square className="mr-2 h-4 w-4" />
              Stop
            </Button>
          </>
        )}
      </div>
      
      <div className="h-24 bg-neutral-50 rounded-lg border border-neutral-200">
        <div className="h-full flex items-center justify-center text-neutral-500">
          {isRecording ? (
            <div className="flex items-center space-x-2">
              <span className="animate-pulse">Recording{isPaused ? ' (Paused)' : ''}</span>
              {!isPaused && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce delay-200" />
                </div>
              )}
            </div>
          ) : isTranscribing ? (
            <div className="flex items-center space-x-2">
              <span>Transcribing audio...</span>
              <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            'Ready to record'
          )}
        </div>
      </div>
    </div>
  );
}