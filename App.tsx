import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Brain, 
  Heart, 
  Briefcase, 
  Users, 
  Activity, 
  CheckCircle, 
  ArrowRight, 
  RefreshCcw, 
  Search, 
  Zap,
  Minimize2,
  Coins,
  Stethoscope,
  Target,
  Sparkles,
  MessageSquare,
  Send,
  Loader2
} from 'lucide-react';
import { CATEGORIES, MBTI_DATA, QUIZ_QUESTIONS } from './constants';
import { CategoryKey, MbtiCode } from './types';
import { callGeminiAPI, isAIEnabled } from './services/geminiService';

// --- 輔助組件 ---

const RadarChart = ({ typeCode }: { typeCode: string }) => {
  const getPoints = (code: string) => {
    const eVal = code.includes('E') ? 80 : 30;
    const nVal = code.includes('N') ? 80 : 30;
    const tVal = code.includes('T') ? 80 : 30;
    const jVal = code.includes('J') ? 80 : 30;

    return `${50},${100-nVal} ${50+eVal/2},50 ${50},${100-jVal+30} ${50-tVal/2},50`;
  };

  return (
    <div className="relative w-full h-56 md:h-64 flex items-center justify-center bg-slate-50 rounded-xl border border-slate-200 p-4">
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible opacity-80">
        {/* 背景網格 */}
        <polygon points="50,10 90,50 50,90 10,50" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
        <polygon points="50,25 75,50 50,75 25,50" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
        <line x1="50" y1="10" x2="50" y2="90" stroke="#e2e8f0" strokeWidth="0.5" />
        <line x1="10" y1="50" x2="90" y2="50" stroke="#e2e8f0" strokeWidth="0.5" />
        
        {/* 標籤 */}
        <text x="50" y="5" textAnchor="middle" fontSize="4" fill="#64748b">直覺 (N) / 實感 (S)</text>
        <text x="95" y="50" textAnchor="start" fontSize="4" fill="#64748b">外向 (E)</text>
        <text x="50" y="98" textAnchor="middle" fontSize="4" fill="#64748b">判斷 (J) / 感知 (P)</text>
        <text x="5" y="50" textAnchor="end" fontSize="4" fill="#64748b">思考 (T)</text>

        {/* 數據圖形 */}
        <polygon 
          points={getPoints(typeCode)} 
          fill="rgba(99, 102, 241, 0.4)" 
          stroke="#4f46e5" 
          strokeWidth="1.5" 
        />
      </svg>
      <div className="absolute bottom-2 right-2 text-xs text-slate-400 font-mono">
        *示意圖表
      </div>
    </div>
  );
};

const AICoach = ({ typeCode }: { typeCode: string }) => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const data = MBTI_DATA[typeCode as MbtiCode];

  if (!isAIEnabled) return null;

  const handleAskAI = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResponse("");
    
    const prompt = `
      你是一位專業的 MBTI 人格發展教練。
      使用者的人格類型是：${typeCode} (${data.name})。
      他們的認知功能堆疊是：${data.functions.join(', ')}。
      使用者的問題是：${query}
      
      請根據這個人格類型的特質、優勢與盲點，給予溫暖、具體且有建設性的建議。
      請用繁體中文回答。
    `;

    const result = await callGeminiAPI(prompt);
    setResponse(result);
    setLoading(false);
  };

  return (
    <section className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 md:p-6 rounded-2xl border border-indigo-100 shadow-inner mt-8">
      <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-4 flex items-center">
        <Sparkles className="w-5 h-5 mr-2 text-purple-600" /> AI 專屬人生教練
      </h3>
      <p className="text-sm text-slate-600 mb-4">
        有關於 {typeCode} 的煩惱嗎？無論是職場溝通、感情困擾或自我成長，都可以問我！
      </p>
      
      <div className="bg-white rounded-xl p-4 shadow-sm border border-indigo-50">
        {response ? (
          <div className="animate-fade-in">
            <div className="flex items-start mb-4 pb-4 border-b border-slate-100">
              <div className="bg-slate-100 p-2 rounded-full mr-3">
                <MessageSquare className="w-4 h-4 text-slate-500" />
              </div>
              <p className="text-slate-700 text-sm mt-1">{query}</p>
            </div>
            <div className="flex items-start">
              <div className="bg-purple-100 p-2 rounded-full mr-3">
                <Sparkles className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-slate-800 text-sm leading-relaxed whitespace-pre-line">
                {response}
              </div>
            </div>
            <button 
              onClick={() => { setResponse(""); setQuery(""); }}
              className="mt-4 text-xs text-slate-400 hover:text-blue-600 underline"
            >
              問另一個問題
            </button>
          </div>
        ) : (
          <div className="relative">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`例如：身為 ${typeCode}，我該如何處理與同事的衝突？`}
              className="w-full p-3 bg-slate-50 rounded-lg text-sm border-none focus:ring-2 focus:ring-purple-300 min-h-[100px] resize-none"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleAskAI}
                disabled={loading || !query.trim()}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-bold text-white transition-all ${loading || !query.trim() ? "bg-slate-300 cursor-not-allowed" : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg transform hover:-translate-y-0.5"}`}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                {loading ? "思考中..." : "傳送請求"}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// --- 主要頁面組件 ---

interface EncyclopediaProps {
  onSelectType: (code: string) => void;
}

const Encyclopedia: React.FC<EncyclopediaProps> = ({ onSelectType }) => {
  const [filter, setFilter] = useState("ALL");

  const filteredTypes = Object.values(MBTI_DATA).filter(t => 
    filter === "ALL" ? true : t.category === filter
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap gap-2 justify-center pb-4 border-b border-slate-200">
        <button 
          onClick={() => setFilter("ALL")}
          className={`px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all ${filter === "ALL" ? "bg-slate-800 text-white shadow-lg" : "bg-white text-slate-600 hover:bg-slate-100"}`}
        >
          全部
        </button>
        {(Object.keys(CATEGORIES) as Array<CategoryKey>).map((key) => (
          <button 
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all ${filter === key ? `${CATEGORIES[key].color.split(' ')[0]} ${CATEGORIES[key].color.split(' ')[1]} ring-2 ring-offset-1 ring-${CATEGORIES[key].color.split('-')[1]}-400` : "bg-white text-slate-600 hover:bg-slate-100"}`}
          >
            {CATEGORIES[key].name.split(' ')[0]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredTypes.map((t) => (
          <div 
            key={t.code}
            onClick={() => onSelectType(t.code)}
            className="group bg-white rounded-xl p-4 md:p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 cursor-pointer transform hover:-translate-y-1 relative overflow-hidden"
          >
            <div className={`absolute top-0 left-0 w-1 h-full ${CATEGORIES[t.category].color.split(' ')[0].replace('bg', 'bg-opacity-100').replace('100', '500')}`}></div>
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl md:text-2xl font-bold text-slate-800">{t.code}</h3>
              <span className="text-xs text-slate-400 font-mono">{CATEGORIES[t.category].name.split(' ')[1].replace(')','').replace('(','')}</span>
            </div>
            <h4 className={`text-base md:text-lg font-medium mb-2 ${CATEGORIES[t.category].color.split(' ')[1]}`}>{t.name}</h4>
            <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed">{t.slogan}</p>
            <div className="mt-4 pt-3 border-t border-slate-50 flex items-center text-slate-400 text-xs group-hover:text-blue-500 transition-colors">
              查看詳情 <ArrowRight className="w-3 h-3 ml-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface TypeDetailProps {
  typeCode: string;
  onBack: () => void;
}

const TypeDetail: React.FC<TypeDetailProps> = ({ typeCode, onBack }) => {
  const data = MBTI_DATA[typeCode as MbtiCode];
  const cat = CATEGORIES[data.category];

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-slide-up">
      {/* Header */}
      <div className={`p-4 md:p-8 ${cat.color.split(' ')[0]} bg-opacity-50 relative`}>
        <button onClick={onBack} className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-white bg-opacity-50 hover:bg-opacity-100 rounded-full transition-all">
          <Minimize2 className="w-5 h-5 text-slate-700" />
        </button>
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          <div className={`w-16 h-16 md:w-24 md:h-24 flex items-center justify-center rounded-2xl bg-white shadow-inner text-xl md:text-3xl font-bold ${cat.color.split(' ')[1]}`}>
            {data.code}
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{data.name}</h2>
            <div className="flex items-center gap-2 mb-3">
               <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium bg-white bg-opacity-60 ${cat.color.split(' ')[1]}`}>
                 {cat.name}
               </span>
            </div>
            <p className="text-slate-700 text-base md:text-lg italic opacity-90">"{data.slogan}"</p>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          <section>
            <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-4 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-blue-500" /> 深度解析
            </h3>
            <p className="text-slate-600 leading-relaxed text-justify text-sm md:text-base">{data.desc}</p>
          </section>

          {/* Life Themes Section */}
          <section className="bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6 rounded-2xl border border-blue-100 shadow-inner">
            <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-6 flex items-center">
              <Target className="w-5 h-5 mr-2 text-indigo-600" /> 全方位人生指南
            </h3>
            <div className="grid grid-cols-1 gap-4">
              
              <div className="bg-white p-4 rounded-xl border border-red-100 shadow-sm hover:shadow-md transition-all flex gap-4 items-start">
                <div className="p-2 bg-red-100 rounded-lg text-red-600 flex-shrink-0">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-red-900 mb-1">愛情與親密關係</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{data.lifeThemes.love}</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all flex gap-4 items-start">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600 flex-shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 mb-1">職場與生涯發展</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{data.lifeThemes.workplace}</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-green-100 shadow-sm hover:shadow-md transition-all flex gap-4 items-start">
                <div className="p-2 bg-green-100 rounded-lg text-green-600 flex-shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-green-900 mb-1">人際與社交課題</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{data.lifeThemes.relationships}</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-yellow-100 shadow-sm hover:shadow-md transition-all flex gap-4 items-start">
                <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600 flex-shrink-0">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-yellow-900 mb-1">金錢與財富觀</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{data.lifeThemes.wealth}</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-teal-100 shadow-sm hover:shadow-md transition-all flex gap-4 items-start">
                <div className="p-2 bg-teal-100 rounded-lg text-teal-600 flex-shrink-0">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-teal-900 mb-1">健康與身心平衡</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{data.lifeThemes.health}</p>
                </div>
              </div>

            </div>
          </section>

          {/* Insert AI Coach Here */}
          <AICoach typeCode={data.code} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-green-50 p-4 md:p-5 rounded-xl border border-green-100">
              <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" /> 優勢
              </h3>
              <ul className="space-y-2">
                {data.strengths.map(s => <li key={s} className="text-slate-700 text-sm flex items-start"><span className="mr-2">•</span>{s}</li>)}
              </ul>
            </section>
            <section className="bg-red-50 p-4 md:p-5 rounded-xl border border-red-100">
              <h3 className="text-lg font-bold text-red-800 mb-3 flex items-center">
                <Activity className="w-5 h-5 mr-2" /> 盲點
              </h3>
              <ul className="space-y-2">
                {data.weaknesses.map(w => <li key={w} className="text-slate-700 text-sm flex items-start"><span className="mr-2">•</span>{w}</li>)}
              </ul>
            </section>
          </div>

          <section>
             <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-4 flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-orange-500" /> 適合職業
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.careers.map(c => (
                <span key={c} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200 transition-colors">
                  {c}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <section className="bg-slate-50 p-4 md:p-6 rounded-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">認知功能堆疊 (Cognitive Functions)</h3>
            <div className="space-y-3">
              {data.functions.map((f, idx) => (
                <div key={f} className="flex items-center justify-between group">
                  <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors">{f}</span>
                  <span className="text-xs text-slate-400 bg-white px-2 py-1 rounded border border-slate-100">
                    {idx === 0 ? "主導 (Dominant)" : idx === 1 ? "輔助 (Auxiliary)" : idx === 2 ? "第三 (Tertiary)" : "劣勢 (Inferior)"}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200 text-xs text-slate-400 leading-tight">
              這些功能決定了您如何處理訊息和做出決定。
            </div>
          </section>

          <section>
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">性格光譜</h3>
             <RadarChart typeCode={data.code} />
          </section>

          <section>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">代表人物</h3>
            <div className="grid grid-cols-2 gap-2">
               {data.characters.map(c => (
                 <div key={c} className="text-xs p-2 bg-slate-50 rounded text-slate-600 text-center">
                   {c}
                 </div>
               ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

interface QuizProps {
  onFinish: (result: string) => void;
}

const Quiz: React.FC<QuizProps> = ({ onFinish }) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQ, setCurrentQ] = useState(0);

  const handleAnswer = (val: string) => {
    const newAnswers = { ...answers, [QUIZ_QUESTIONS[currentQ].id]: val };
    setAnswers(newAnswers);
    
    if (currentQ < QUIZ_QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: Record<number, string>) => {
    let scores: Record<string, number> = { E:0, I:0, S:0, N:0, T:0, F:0, J:0, P:0 };
    
    QUIZ_QUESTIONS.forEach(q => {
      const ans = finalAnswers[q.id]; // 'a' or 'b'
      const type = ans === 'a' ? q.a.slice(-2, -1) : q.b.slice(-2, -1);
      scores[type]++;
    });

    const result = 
      (scores.E >= scores.I ? "E" : "I") +
      (scores.S >= scores.N ? "S" : "N") +
      (scores.T >= scores.F ? "T" : "F") +
      (scores.J >= scores.P ? "J" : "P");
      
    onFinish(result);
  };

  const q = QUIZ_QUESTIONS[currentQ];
  const progress = ((currentQ) / QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="max-w-2xl mx-auto bg-white p-4 md:p-8 rounded-2xl shadow-xl border border-slate-100">
      <div className="mb-8">
        <div className="flex justify-between text-xs text-slate-400 mb-2 uppercase font-bold tracking-wider">
          <span>進度</span>
          <span>{currentQ + 1} / {QUIZ_QUESTIONS.length}</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 text-center">{q.q}</h2>

      <div className="grid grid-cols-1 gap-4">
        <button 
          onClick={() => handleAnswer('a')}
          className="p-4 md:p-6 border-2 border-slate-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
        >
          <span className="font-bold text-blue-900 group-hover:text-blue-700">A.</span> {q.a.slice(0, -4)}
        </button>
        <button 
          onClick={() => handleAnswer('b')}
          className="p-4 md:p-6 border-2 border-slate-100 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all text-left group"
        >
          <span className="font-bold text-purple-900 group-hover:text-purple-700">B.</span> {q.b.slice(0, -4)}
        </button>
      </div>
    </div>
  );
};

const CompatibilityLab = () => {
  const [typeA, setTypeA] = useState("INTJ");
  const [typeB, setTypeB] = useState("ENFP");
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const calculateCompatibility = (t1: string, t2: string) => {
    let score = 0;
    let analysis = [];
    
    if (t1[0] !== t2[0]) {
      score += 25;
      analysis.push("能量互補 (E/I)：你們的社交能量能夠互相平衡。");
    } else {
      score += 15;
      analysis.push("能量相似 (E/I)：你們有相似的社交節奏。");
    }

    if (t1[1] === t2[1]) {
      score += 30;
      analysis.push("視野一致 (S/N)：你們關注事物的角度相似，溝通無障礙。");
    } else {
      score += 5;
      analysis.push("視野差異 (S/N)：一個人看樹木，一個人看森林，需要多花時間理解對方。");
    }

    if (t1[2] !== t2[2]) {
      score += 20;
      analysis.push("決策互補 (T/F)：理性與感性的結合，決策更全面。");
    } else {
      score += 15;
      analysis.push("價值觀共鳴 (T/F)：你們對事情的判斷標準很像。");
    }

    if (t1[3] !== t2[3]) {
      score += 25;
      analysis.push("生活節奏 (J/P)：計劃者與執行者的完美搭配。");
    } else {
      score += 10;
      analysis.push("生活風格 (J/P)：可能會有共同的混亂或共同的僵化。");
    }

    return { score, analysis };
  };

  const result = useMemo(() => calculateCompatibility(typeA, typeB), [typeA, typeB]);

  const handleAIAnalysis = async () => {
    setLoading(true);
    setAiAnalysis("");
    const prompt = `
      你是一位 MBTI 關係專家。
      請深度分析 ${typeA} (${MBTI_DATA[typeA as MbtiCode].name}) 與 ${typeB} (${MBTI_DATA[typeB as MbtiCode].name}) 的關係。
      請涵蓋以下重點：
      1. 雙方的認知功能如何互動（例如 ${typeA} 的 ${MBTI_DATA[typeA as MbtiCode].functions[0]} 如何影響 ${typeB}）。
      2. 潛在的衝突引爆點。
      3. 給雙方維持長久關係的具體建議。
      
      請用繁體中文回答，語氣專業但溫暖。
    `;
    const response = await callGeminiAPI(prompt);
    setAiAnalysis(response);
    setLoading(false);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase">甲方</label>
          <select 
            value={typeA} 
            onChange={(e) => setTypeA(e.target.value)}
            className="w-full p-3 bg-slate-50 rounded-lg font-bold text-slate-700 border-none focus:ring-2 focus:ring-blue-500"
          >
            {(Object.keys(MBTI_DATA) as Array<MbtiCode>).map(k => <option key={k} value={k}>{k} ({MBTI_DATA[k].name})</option>)}
          </select>
        </div>

        <div className="flex justify-center text-slate-300">
           <RefreshCcw className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase">乙方</label>
          <select 
            value={typeB} 
            onChange={(e) => setTypeB(e.target.value)}
            className="w-full p-3 bg-slate-50 rounded-lg font-bold text-slate-700 border-none focus:ring-2 focus:ring-purple-500"
          >
            {(Object.keys(MBTI_DATA) as Array<MbtiCode>).map(k => <option key={k} value={k}>{k} ({MBTI_DATA[k].name})</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white p-4 md:p-8 rounded-2xl shadow-xl border-t-4 border-blue-500 text-center">
        <h3 className="text-slate-400 font-bold tracking-widest uppercase text-sm mb-2">契合度指數</h3>
        <div className="text-4xl md:text-6xl font-black text-slate-800 mb-6">{result.score}%</div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto mb-8">
          {result.analysis.map((item, idx) => (
            <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex items-start">
              <div className={`w-2 h-2 rounded-full mt-1.5 mr-3 flex-shrink-0 ${idx % 2 === 0 ? 'bg-blue-400' : 'bg-purple-400'}`}></div>
              <span className="text-slate-700 text-sm">{item}</span>
            </div>
          ))}
        </div>

        {/* AI Analysis Section */}
        <div className="pt-8 border-t border-slate-100">
          {!aiAnalysis && !loading ? (
            isAIEnabled ? (
              <button 
                onClick={handleAIAnalysis}
                className="flex items-center justify-center mx-auto px-4 py-2 md:px-6 md:py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all text-sm md:text-base"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                ✨ 獲取 AI 深度關係解析
              </button>
            ) : null
          ) : (
            <div className="bg-rose-50 rounded-xl p-4 md:p-6 text-left border border-rose-100 animate-fade-in">
              <h4 className="text-rose-800 font-bold mb-4 flex items-center text-sm md:text-base">
                {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
                {loading ? "AI 正在深入分析兩人的認知功能..." : "Gemini AI 深度解析報告"}
              </h4>
              <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                {aiAnalysis}
              </div>
              {!loading && (
                <button 
                  onClick={handleAIAnalysis}
                  className="mt-4 text-xs text-rose-500 hover:text-rose-700 underline flex items-center"
                >
                  <RefreshCcw className="w-3 h-3 mr-1" /> 重新分析
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- 主應用入口 ---

export default function App() {
  const [currentTab, setCurrentTab] = useState("encyclopedia");
  const [detailType, setDetailType] = useState<string | null>(null);
  
  const handleFinishQuiz = (result: string) => {
    setDetailType(result);
    setCurrentTab("encyclopedia");
    window.scrollTo(0,0);
  };

  const renderContent = () => {
    if (currentTab === "encyclopedia") {
      if (detailType) return <TypeDetail typeCode={detailType} onBack={() => setDetailType(null)} />;
      return <Encyclopedia onSelectType={(code: string) => { setDetailType(code); window.scrollTo(0,0); }} />;
    }
    if (currentTab === "quiz") return <Quiz onFinish={handleFinishQuiz} />;
    if (currentTab === "lab") return <CompatibilityLab />;
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      {/* NEW HEADER SECTION with KIWIMU branding */}
      <div className="bg-white w-full flex flex-col items-center justify-center py-4 md:py-8 border-b border-slate-100 shadow-sm transition-all">
        <div className="flex items-center justify-center gap-3 md:gap-6">
            {/* Character GIF with Link */}
            <a 
              href="https://linktr.ee/moon_moon_dessert?utm_source=linktree_profile_share&ltsid=dab722d1-78b5-41ef-afd6-79844b835911" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-transform hover:scale-105 cursor-pointer"
              title="前往 KIWIMU 的 Linktree"
            >
              <img 
                src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNTZtbnl3YjAwN3pvemF1MnlzYzdrMDI0ZWJicmMzNHd0MmMxYmx1bSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LTRNEJfeVV17OTUEGF/giphy.gif" 
                alt="KIWIMU Character" 
                className="h-20 w-20 md:h-32 md:w-32 rounded-full object-cover shadow-lg border-4 border-white bg-slate-50"
              />
            </a>
        </div>
        <p className="text-slate-400 text-xs md:text-sm mt-2 tracking-widest uppercase font-medium">KIWIMU©</p>
      </div>

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-lg bg-opacity-90">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => {setDetailType(null); setCurrentTab("encyclopedia");}}>
              <Brain className="w-6 h-6 md:w-8 md:h-8 text-blue-600 mr-2" />
              <span className="font-black text-lg md:text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                MBTI<span className="font-light text-slate-400">Lab</span>
              </span>
            </div>
            
            <div className="flex space-x-1 md:space-x-4">
              <button 
                onClick={() => {setDetailType(null); setCurrentTab("encyclopedia");}}
                className={`px-2 py-2 md:px-3 md:py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${currentTab === "encyclopedia" ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-900"}`}
              >
                <Search className="w-4 h-4 mr-1.5" /> <span className="hidden md:inline">全像百科</span>
              </button>
              <button 
                onClick={() => setCurrentTab("quiz")}
                className={`px-2 py-2 md:px-3 md:py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${currentTab === "quiz" ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-900"}`}
              >
                <Zap className="w-4 h-4 mr-1.5" /> <span className="hidden md:inline">性格測驗</span>
              </button>
              <button 
                onClick={() => setCurrentTab("lab")}
                className={`px-2 py-2 md:px-3 md:py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${currentTab === "lab" ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-900"}`}
              >
                <Heart className="w-4 h-4 mr-1.5" /> <span className="hidden md:inline">關係模擬</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">
            © 2024 MBTI Lab. 此工具僅供娛樂與自我探索參考，並非專業心理診斷。
          </p>
        </div>
      </footer>
    </div>
  );
}