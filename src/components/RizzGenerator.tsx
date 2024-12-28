import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import OpenAI from 'openai';

const RizzGenerator = () => {
  const [name, setName] = useState('');
  const [style, setStyle] = useState('berbau jokes 18+');
  const [generatedRizz, setGeneratedRizz] = useState('');
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState('');

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

  const generateRizz = async () => {
    if (!name) {
      setGeneratedRizz('Masukkan nama orang yang lu suka ya! 😊');
      return;
    }

    setLoading(true);

    try {
      const prompt = `Buatin gue rizz sesuai style yang di pilih buat orang yang bernama ${name}.
        Gaya: ${style}
        ${context ? `Konteks tambahan: ${context}` : ''}
        Kasih respon singkat (maksimal 2 kalimat) dengan sarcasm 18+, sama jangan cringe, dan juga coba diselingin bahasa inggris dan slang yang gaul sertakan emoji yang sesuai. Dan jangan stuck di satu topik, sama jika ada kata dewasa, atau 18+ kamu bisa pake sensor "beep" ya`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "lu adalah master yang jago banget buat ngerizz semua makhluk di dunia ini, dengan rizz lu pasti semua makhluk di dunia ini suka sama lu, tapi jangan cringe ya"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 100
      });

      setGeneratedRizz(completion.choices[0].message.content || 'No response generated');
    } catch (error) {
      console.error('Error:', error);
      setGeneratedRizz('Maaf, ada kesalahan saat generate rizz. Coba lagi ya! 🙏');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">AI Rizz Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nama Crush</label>
          <Input
            type="text"
            placeholder="Masukkan nama..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Gaya Rizz</label>
          <Select value={style} onValueChange={setStyle}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih gaya rizz" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="berbau jokes 18+">Hot banget 🌶️</SelectItem>
              <SelectItem value="lucu dan bikin deg-degan">Lucu 🤣</SelectItem>
              <SelectItem value="sarcasm dan berbau jokes 18+">Sarcasm 🤨</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Konteks (Opsional)</label>
          <Textarea
            placeholder="Misal: suka film yang sama, suka game yang sama, suka musik yang sama, dll"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        <Button 
          onClick={generateRizz}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={loading}
        >
          {loading ? 'Generating... 🤔' : 'Generate Rizz ✨'}
        </Button>

        {generatedRizz && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-center text-gray-800">{generatedRizz}</p>
          </div>
        )}
        <div className="text-center text-sm text-gray-500 mt-4">
          Made by <a href="https://instagram.com/virhanali" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">@virhanali</a>
        </div>
      </CardContent>
    </Card>
  );
};

export default RizzGenerator;
