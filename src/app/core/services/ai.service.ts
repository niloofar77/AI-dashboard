import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Message, Conversation } from '../models/message.model';
import { environment } from '../../../environments/enviroment';

interface AvalMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface AvalRequest {
  model: string;
  messages: AvalMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

interface AvalResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private conversations = new BehaviorSubject<Conversation[]>([]);
  private currentConversation = new BehaviorSubject<Conversation | null>(null);
  private isGenerating = new BehaviorSubject<boolean>(false);
  
  conversations$ = this.conversations.asObservable();
  currentConversation$ = this.currentConversation.asObservable();
  isGenerating$ = this.isGenerating.asObservable();

  private readonly API_URL = environment.avalApi.baseUrl;
  private readonly API_KEY = environment.avalApi.apiKey;

  constructor() {
    this.loadConversations();
  }

  private loadConversations() {
    const saved = localStorage.getItem('aval_conversations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.conversations.next(parsed);
      } catch (error) {
        console.error('خطا در بارگذاری مکالمات:', error);
      }
    }
  }

  createNewConversation(): Conversation {
    const newConv: Conversation = {
      id: this.generateId(),
      title: 'New  Conversation ',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const convs = this.conversations.value;
    convs.unshift(newConv);
    this.conversations.next(convs);
    this.currentConversation.next(newConv);
    this.saveConversations();
    
    return newConv;
  }
  async sendMessage(content: string, file?: File): Promise<void> {
    let conv = this.currentConversation.value;
  
    if (!conv) {
      conv = this.createNewConversation();
    }
  
    const userMessage: Message = {
      id: this.generateId(),
      role: 'user',
      content,
      timestamp: new Date()
    };
    
    conv.messages.push(userMessage);
    this.updateConversation(conv);
    this.isGenerating.next(true);
  
    try {
      const response = await this.callAvalAPI(conv.messages, file); 
      
      const aiMessage: Message = {
        id: this.generateId(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      conv.messages.push(aiMessage);
      this.updateConversation(conv);
    } catch (error) {
      console.error('خطا در فراخوانی Aval API:', error);
      const errorMessage: Message = {
        id: this.generateId(),
        role: 'assistant',
        content: 'متأسفانه خطایی رخ داد. لطفاً دوباره تلاش کنید.',
        timestamp: new Date()
      };
      conv.messages.push(errorMessage);
      this.updateConversation(conv);
    } finally {
      this.isGenerating.next(false);
    }
  }
  


  async callAvalAPI(messages: Message[], file?: File): Promise<string> {
    const avalMessages: AvalMessage[] = messages.map(m => ({
      role: m.role,
      content: m.content
    }));
  
    const requestBody: AvalRequest = {
      model: 'gpt-4o-mini',
      messages: avalMessages,
      temperature: 0.7,
      max_tokens: 2000,
      stream: false
    };
  
    if (file) {
      console.log("file",file)
      const formData = new FormData();
      formData.append('file', file);
      formData.append('messages', JSON.stringify(requestBody));
      
      try {
        const response = await fetch(`${this.API_URL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.API_KEY}`
          },
          body: formData
        });
  
        if (!response.ok) {
          throw new Error('خطا در درخواست API');
        }
  
        const data: AvalResponse = await response.json();
        return data.choices[0].message.content;
      } catch (error) {
        console.error('خطای Aval API:', error);
        throw error;
      }
    } else {

      try {
        const response = await fetch(`${this.API_URL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.API_KEY}`
          },
          body: JSON.stringify(requestBody)
        });
  
        if (!response.ok) {
          throw new Error('خطا در درخواست API');
        }
  
        const data: AvalResponse = await response.json();
        return data.choices[0].message.content;
      } catch (error) {
        console.error('خطای Aval API:', error);
        throw error;
      }}
    }
    
  async sendMessageStream(
    content: string, 
    onChunk: (chunk: string) => void
  ): Promise<void> {
    let conv = this.currentConversation.value;
    
    if (!conv) {
      conv = this.createNewConversation();
    }

    const userMessage: Message = {
      id: this.generateId(),
      role: 'user',
      content,
      timestamp: new Date()
    };
    
    conv.messages.push(userMessage);
    this.updateConversation(conv);
    this.isGenerating.next(true);

    const aiMessage: Message = {
      id: this.generateId(),
      role: 'assistant',
      content: '',
      timestamp: new Date()
    };
    
    conv.messages.push(aiMessage);
    this.updateConversation(conv);

    try {
      await this.callAvalAPIStream(conv.messages.slice(0, -1), (chunk) => {
        aiMessage.content += chunk;
        this.updateConversation(conv!);
        onChunk(chunk);
      });

      if (conv.messages.length === 2) {
        conv.title = this.generateTitle(content);
      }
      
      this.updateConversation(conv);
    } catch (error) {
      console.error('خطا در Streaming:', error);
      aiMessage.content = 'متأسفانه خطایی رخ داد. لطفاً دوباره تلاش کنید.';
      this.updateConversation(conv);
    } finally {
      this.isGenerating.next(false);
    }
  }

  private async callAvalAPIStream(
    messages: Message[],
    onChunk: (chunk: string) => void
  ): Promise<void> {
    const avalMessages: AvalMessage[] = messages.map(m => ({
      role: m.role,
      content: m.content
    }));

    const requestBody: AvalRequest = {
      model: 'gpt-3.5-turbo-1106',
      messages: avalMessages,
      temperature: 0.7,
      max_tokens: 2000,
      stream: true
    };

    const response = await fetch(`${this.API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error('خطا در درخواست Streaming');
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('Reader موجود نیست');
    }

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          
          if (data === '[DONE]') {
            return;
          }

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            
            if (content) {
              onChunk(content);
            }
          } catch (e) {
            console.error('خطا در پارس کردن chunk:', e);
          }
        }
      }
    }
  }

  selectConversation(id: string) {
    const conv = this.conversations.value.find(c => c.id === id);
    if (conv) {
      this.currentConversation.next(conv);
    }
  }

  deleteConversation(id: string) {
    const convs = this.conversations.value.filter(c => c.id !== id);
    this.conversations.next(convs);
    
    if (this.currentConversation.value?.id === id) {
      this.currentConversation.next(null);
    }
    
    this.saveConversations();
  }

  clearAllConversations() {
    this.conversations.next([]);
    this.currentConversation.next(null);
    localStorage.removeItem('aval_conversations');
  }

  private updateConversation(conv: Conversation) {
    conv.updatedAt = new Date();
    const convs = this.conversations.value;
    const index = convs.findIndex(c => c.id === conv.id);
    
    if (index !== -1) {
      convs[index] = { ...conv };
      this.conversations.next([...convs]);
    }
    
    this.currentConversation.next({ ...conv });
    this.saveConversations();
  }

  private saveConversations() {
    localStorage.setItem('aval_conversations', JSON.stringify(this.conversations.value));
  }

  private generateTitle(content: string): string {
    const maxLength = 30;
    return content.length > maxLength 
      ? content.substring(0, maxLength) + '...' 
      : content;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}