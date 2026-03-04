// ─────────────────────────────────────────────────
// Htech · Ask Doctor Page
// Rule-based AI health assistant (NOT medical advice)
// ─────────────────────────────────────────────────

import { useState, useCallback, useRef, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useDiabetes } from '../hooks/useDiabetes';

import { Button } from '../components/Button';
import { Card } from '../components/Card';

// ── Message types ──────────────────────────────

interface ChatMessage {
    readonly id: string;
    readonly role: 'user' | 'assistant';
    readonly text: string;
    readonly timestamp: string;
}

// ── Rule-based response engine ─────────────────

interface Rule {
    readonly keywords: string[];
    readonly responseEn: string;
    readonly responseAr: string;
}

const RULES: readonly Rule[] = [
    {
        keywords: ['منظم', 'جرعة', 'جرعات', 'مرات باليوم', 'حبة', 'حبات', 'مليغرام', 'انسلوين', 'dose', 'metformin', 'mg'],
        responseEn:
            'It looks like you are sharing specific medication dosages (like Metformin or Insulin amounts). Combining oral medications with insulin is a very common and effective treatment plan. However, evaluating if these exact doses are correct for you requires analyzing your daily blood sugar logs, weight, and overall health. Please share your daily readings with your doctor so they can safely adjust your doses if needed.\n\n⚠️ I am an AI assistant, not a doctor. Always consult your healthcare provider before adjusting any medication.',
        responseAr:
            'يبدو أنك تشارك تفاصيل جرعاتك الطبية (مثل المنظم أو الأنسولين). الجمع بين الأدوية الفموية وحقن الأنسولين المتعددة هو خطة علاجية شائعة وفعالة جداً. لكن لا يمكنني تقييم ما إذا كانت هذه الجرعات المحددة مناسبة لك، حيث يتطلب ذلك متابعة قراءات السكر اليومية بانتظام. يرجى مشاركة سجل قراءاتك مع طبيبك ليقوم بتعديل الجرعات بأمان إذا لزم الأمر.\n\n⚠️ أنا مساعد ذكي ولست طبيباً. استشر طبيبك دائماً قبل تغيير أي جرعة طبيّة.',
    },
    {
        keywords: ['high', 'sugar', 'ارتفاع', 'سكر', 'hyperglycemia', 'مرتفع'],
        responseEn:
            'High blood sugar (hyperglycemia) can occur when you eat too many carbs, miss medication, or feel stressed. General tips: stay hydrated, take a walk, and check your blood sugar again in 30 minutes. If it stays above 300 mg/dL, contact your doctor immediately.\n\n⚠️ This is general information, not medical advice.',
        responseAr:
            'ارتفاع السكر في الدم يمكن أن يحدث عند تناول الكثير من الكربوهيدرات، أو نسيان الدواء، أو الشعور بالتوتر. نصائح عامة: اشرب الماء، تمشى قليلاً، وافحص السكر مرة أخرى بعد 30 دقيقة. إذا بقي فوق 300 ملغ/دل، تواصل مع طبيبك فوراً.\n\n⚠️ هذه معلومات عامة وليست نصيحة طبية.',
    },
    {
        keywords: ['low', 'hypo', 'انخفاض', 'منخفض', 'hypoglycemia', 'هبوط'],
        responseEn:
            'Low blood sugar (hypoglycemia) can feel like dizziness, shaking, or sweating. If your blood sugar is below 70 mg/dL: eat 15g of fast-acting sugar (juice, glucose tabs), wait 15 minutes, then recheck. If below 54 mg/dL, this is an emergency — seek help immediately.\n\n⚠️ This is general information, not medical advice.',
        responseAr:
            'انخفاض السكر في الدم يمكن أن يسبب دوخة، رجفة، أو تعرق. إذا كان السكر أقل من 70 ملغ/دل: تناول 15 غرام من السكر السريع (عصير، أقراص جلوكوز)، انتظر 15 دقيقة، ثم أعد الفحص. إذا كان أقل من 54 ملغ/دل، هذه حالة طارئة — اطلب المساعدة فوراً.\n\n⚠️ هذه معلومات عامة وليست نصيحة طبية.',
    },
    {
        keywords: ['insulin', 'أنسولين', 'حقن', 'injection'],
        responseEn:
            'Insulin is essential for Type 1 diabetes and sometimes needed for Type 2. Always store insulin properly (2-8°C for unopened). Rotate injection sites. Never skip your insulin dose without consulting your doctor. Track your doses along with meals and activity for best results.\n\n⚠️ This is general information, not medical advice.',
        responseAr:
            'الأنسولين ضروري لمرضى السكري النوع الأول وأحياناً النوع الثاني. احفظ الأنسولين بشكل صحيح (2-8 درجات مئوية للعبوات المغلقة). بدّل مواقع الحقن. لا تتوقف عن جرعتك بدون استشارة طبيبك. تابع جرعاتك مع الوجبات والنشاط للحصول على أفضل النتائج.\n\n⚠️ هذه معلومات عامة وليست نصيحة طبية.',
    },
    {
        keywords: ['food', 'eat', 'diet', 'carb', 'أكل', 'طعام', 'غذاء', 'كربوهيدرات', 'حمية'],
        responseEn:
            'A balanced diet is key to managing diabetes. Focus on: fiber-rich vegetables, lean proteins, healthy fats, and whole grains. Count your carbs — aim for consistent amounts at each meal. Avoid sugary drinks and processed foods. Consider working with a dietitian for a personalized plan.\n\n⚠️ This is general information, not medical advice.',
        responseAr:
            'النظام الغذائي المتوازن ضروري لإدارة السكري. ركز على: الخضروات الغنية بالألياف، البروتينات الخفيفة، الدهون الصحية، والحبوب الكاملة. احسب الكربوهيدرات — حاول الحفاظ على كميات ثابتة في كل وجبة. تجنب المشروبات السكرية والأطعمة المصنعة.\n\n⚠️ هذه معلومات عامة وليست نصيحة طبية.',
    },
    {
        keywords: ['exercise', 'sport', 'walk', 'تمرين', 'رياضة', 'مشي', 'نشاط'],
        responseEn:
            'Regular physical activity helps improve insulin sensitivity. Aim for 150 minutes per week of moderate activity (walking, swimming, cycling). Check your blood sugar before and after exercise. Carry fast-acting sugar during workouts. Avoid exercising if blood sugar is above 300 mg/dL.\n\n⚠️ This is general information, not medical advice.',
        responseAr:
            'النشاط البدني المنتظم يساعد على تحسين حساسية الأنسولين. حاول ممارسة 150 دقيقة أسبوعياً من النشاط المعتدل (مشي، سباحة، دراجة). افحص السكر قبل وبعد التمرين. احمل سكر سريع المفعول أثناء التمرين. تجنب التمرين إذا كان السكر فوق 300 ملغ/دل.\n\n⚠️ هذه معلومات عامة وليست نصيحة طبية.',
    },
    {
        keywords: ['hba1c', 'a1c', 'تراكمي'],
        responseEn:
            'HbA1c (A1c) measures your average blood sugar over the past 2-3 months. A target of below 7% is recommended for most adults with diabetes (ADA guidelines). Higher levels indicate poor glucose control. Regular A1c testing (every 3-6 months) helps track long-term management.\n\n⚠️ This is general information, not medical advice.',
        responseAr:
            'تحليل HbA1c (السكر التراكمي) يقيس متوسط السكر خلال 2-3 أشهر الماضية. الهدف أقل من 7% لمعظم البالغين المصابين بالسكري (إرشادات ADA). المستويات الأعلى تشير إلى ضعف التحكم. الفحص المنتظم (كل 3-6 أشهر) يساعد في متابعة الإدارة طويلة المدى.\n\n⚠️ هذه معلومات عامة وليست نصيحة طبية.',
    },
    {
        keywords: ['stress', 'anxiety', 'توتر', 'قلق', 'ضغط'],
        responseEn:
            'Stress can significantly raise blood sugar levels through cortisol release. Techniques to manage: deep breathing, meditation, regular sleep (7-9 hours), physical activity, and staying connected with loved ones. Consider speaking with a mental health professional if stress persists.\n\n⚠️ This is general information, not medical advice.',
        responseAr:
            'التوتر يمكن أن يرفع السكر بشكل كبير من خلال هرمون الكورتيزول. تقنيات للإدارة: التنفس العميق، التأمل، النوم المنتظم (7-9 ساعات)، النشاط البدني، والتواصل مع الأحبة. فكر في التحدث مع متخصص في الصحة النفسية إذا استمر التوتر.\n\n⚠️ هذه معلومات عامة وليست نصيحة طبية.',
    },
    {
        keywords: ['type 1', 'type1', 'نوع أول', 'نوع 1', 'النوع الأول'],
        responseEn:
            'Type 1 Diabetes is an autoimmune condition where the body does not produce insulin. It requires lifelong insulin therapy. Key management: multiple daily insulin injections or insulin pump, carb counting, regular blood sugar monitoring, and consistent meal schedules.\n\n⚠️ This is general information, not medical advice.',
        responseAr:
            'السكري النوع الأول هو حالة مناعية ذاتية حيث لا ينتج الجسم الأنسولين. يتطلب العلاج بالأنسولين مدى الحياة. اللإدارة: حقن أنسولين يومية متعددة أو مضخة أنسولين، حساب الكربوهيدرات، مراقبة منتظمة للسكر، ومواعيد وجبات ثابتة.\n\n⚠️ هذه معلومات عامة وليست نصيحة طبية.',
    },
    {
        keywords: ['type 2', 'type2', 'نوع ثاني', 'نوع 2', 'النوع الثاني'],
        responseEn:
            'Type 2 Diabetes is characterized by insulin resistance. Management focuses on: healthy diet, regular exercise, weight management, and medications (metformin and others). Some people may eventually need insulin. Lifestyle changes can significantly improve blood sugar control.\n\n⚠️ This is general information, not medical advice.',
        responseAr:
            'السكري النوع الثاني يتميز بمقاومة الأنسولين. الإدارة تركز على: نظام غذائي صحي، تمارين منتظمة، إدارة الوزن، والأدوية (ميتفورمين وغيرها). قد يحتاج البعض للأنسولين مستقبلاً. تغييرات نمط الحياة تحسن التحكم بالسكر بشكل كبير.\n\n⚠️ هذه معلومات عامة وليست نصيحة طبية.',
    },
    {
        keywords: ['sleep', 'نوم', 'rest', 'راحة'],
        responseEn:
            'Quality sleep is crucial for blood sugar control. Poor sleep increases insulin resistance. Tips: aim for 7-9 hours, maintain a consistent schedule, avoid screens before bed, and keep the room cool and dark. If you have sleep apnea, treating it can improve diabetes management.\n\n⚠️ This is general information, not medical advice.',
        responseAr:
            'النوم الجيد ضروري للتحكم بالسكر. قلة النوم تزيد مقاومة الأنسولين. نصائح: نم 7-9 ساعات، حافظ على جدول ثابت، تجنب الشاشات قبل النوم، واجعل الغرفة باردة ومظلمة. إذا كنت تعاني من انقطاع النفس أثناء النوم، علاجه يحسن إدارة السكري.\n\n⚠️ هذه معلومات عامة وليست نصيحة طبية.',
    },
];

const DEFAULT_RESPONSE_EN =
    "I can help with general diabetes topics like blood sugar management, diet, exercise, insulin, and lifestyle tips. Try asking about any of these! Remember, I'm not a doctor and cannot provide medical diagnoses or treatment recommendations.\n\n⚠️ Always consult your healthcare provider for personalized medical advice.";
const DEFAULT_RESPONSE_AR =
    'يمكنني المساعدة بمواضيع السكري العامة مثل إدارة السكر، الغذاء، التمارين، الأنسولين، ونصائح نمط الحياة. جرب السؤال عن أي من هذه! تذكر، أنا لست طبيباً ولا أستطيع تقديم تشخيصات أو توصيات علاجية.\n\n⚠️ استشر مقدم الرعاية الصحية دائماً للحصول على نصيحة طبية شخصية.';

function getAIResponse(question: string, language: 'ar' | 'en'): string {
    const lowerQ = question.toLowerCase();
    for (const rule of RULES) {
        if (rule.keywords.some((kw) => lowerQ.includes(kw.toLowerCase()))) {
            return language === 'ar' ? rule.responseAr : rule.responseEn;
        }
    }
    return language === 'ar' ? DEFAULT_RESPONSE_AR : DEFAULT_RESPONSE_EN;
}

// ── Component ──────────────────────────────────

export function AskDoctorPage() {
    const { t, language, isRTL } = useLanguage();
    const { getLatestReading } = useDiabetes();
    const [messages, setMessages] = useState<ChatMessage[]>(() => [
        {
            id: 'greeting',
            role: 'assistant',
            text: language === 'ar'
                ? 'مرحباً! أنا المساعد الصحي في Htech. يمكنني مساعدتك بمعلومات عامة عن السكري. اسألني عن ارتفاع أو انخفاض السكر، الأنسولين، الغذاء، التمارين، أو أي شيء آخر!\n\n⚠️ أنا لست طبيباً — استشر طبيبك دائماً.'
                : "Hello! I'm Htech's Health Assistant. I can help with general diabetes information. Ask me about high/low blood sugar, insulin, diet, exercise, or anything else!\n\n⚠️ I am not a doctor — always consult your physician.",
            timestamp: new Date().toISOString(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showQuestions, setShowQuestions] = useState(false);
    const [questionsCopied, setQuestionsCopied] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = useCallback(() => {
        if (!input.trim()) return;

        const userMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'user',
            text: input.trim(),
            timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Simulate typing delay
        setTimeout(() => {
            const latestReading = getLatestReading();
            let contextPrefix = '';
            if (latestReading) {
                contextPrefix =
                    language === 'ar'
                        ? `📊 آخر قراءة لديك: ${latestReading.value} ملغ/دل (${t(latestReading.mealContext)})\n\n`
                        : `📊 Your latest reading: ${latestReading.value} mg/dL (${t(latestReading.mealContext)})\n\n`;
            }

            const response = getAIResponse(userMessage.text, language);

            // Append random doctor questions to encourage consulting a professional
            const shuffledQs = [...doctorQuestionKeys].sort(() => 0.5 - Math.random());
            const randomQs = shuffledQs.slice(0, 2); // Pick 2 random questions
            const suffixTitle = language === 'ar' ? '\n\n👨‍⚕️ اسأل طبيبك:' : '\n\n👨‍⚕️ Ask your doctor:';
            const suffixQs = randomQs.map((qKey, idx) => `\n${idx + 1}. ${t(qKey)}`).join('');

            const aiMessage: ChatMessage = {
                id: crypto.randomUUID(),
                role: 'assistant',
                text: contextPrefix + response + suffixTitle + suffixQs,
                timestamp: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, aiMessage]);
            setIsTyping(false);
        }, 800 + Math.random() * 700);
    }, [input, language, getLatestReading, t]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        },
        [handleSend],
    );

    // Quick suggestion chips
    const suggestions =
        language === 'ar'
            ? ['ارتفاع السكر', 'انخفاض السكر', 'الأنسولين', 'النظام الغذائي', 'التمارين']
            : ['High sugar', 'Low sugar', 'Insulin', 'Diet tips', 'Exercise'];

    // Doctor questions
    const doctorQuestionKeys = [
        'doctor_q1', 'doctor_q2', 'doctor_q3', 'doctor_q4', 'doctor_q5',
        'doctor_q6', 'doctor_q7', 'doctor_q8', 'doctor_q9', 'doctor_q10',
    ];

    const handleCopyQuestions = useCallback(() => {
        const allQuestions = doctorQuestionKeys.map((key, i) => `${i + 1}. ${t(key)}`).join('\n');
        navigator.clipboard.writeText(allQuestions).then(() => {
            setQuestionsCopied(true);
            setTimeout(() => setQuestionsCopied(false), 2000);
        });
    }, [t]);

    return (
        <div
            className="page"
            id="ask-doctor-page"
            style={{
                display: 'flex',
                flexDirection: 'column',
                padding: 0,
                paddingBottom: 0,
            }}
        >
            {/* ── Header ──────────────────────────── */}
            <div
                style={{
                    padding: '20px 16px 16px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                    background: 'rgba(10, 15, 28, 0.95)',
                }}
            >
                <h1
                    style={{
                        fontSize: '22px',
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #00d4aa, #6366f1)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    🩺 {t('ask_ai')}
                </h1>
                <p style={{ fontSize: '12px', color: '#f59e0b', marginTop: '6px' }}>
                    ⚠️ {t('ai_disclaimer')}
                </p>
            </div>

            {/* ── Questions to Ask Your Doctor ───── */}
            <div
                style={{
                    padding: '0 16px',
                    marginTop: '12px',
                }}
            >
                <button
                    id="toggle-doctor-questions"
                    onClick={() => setShowQuestions(!showQuestions)}
                    style={{
                        width: '100%',
                        padding: '14px 16px',
                        borderRadius: '14px',
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(0, 212, 170, 0.08))',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.25s ease',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '20px' }}>📋</span>
                        <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#a5b4fc' }}>
                                {t('questions_for_doctor')}
                            </p>
                            <p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                                {t('questions_for_doctor_desc')}
                            </p>
                        </div>
                    </div>
                    <span
                        style={{
                            fontSize: '16px',
                            color: '#64748b',
                            transition: 'transform 0.25s ease',
                            transform: showQuestions ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}
                    >
                        ▼
                    </span>
                </button>

                {showQuestions && (
                    <Card
                        style={{
                            marginTop: '8px',
                            animation: 'slideUp 0.3s ease',
                            padding: '16px',
                        }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {doctorQuestionKeys.map((key, i) => (
                                <div
                                    key={key}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '10px',
                                        padding: '10px 12px',
                                        borderRadius: '10px',
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid rgba(255, 255, 255, 0.04)',
                                    }}
                                >
                                    <span
                                        style={{
                                            minWidth: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, rgba(0, 212, 170, 0.2), rgba(99, 102, 241, 0.2))',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '11px',
                                            fontWeight: 700,
                                            color: '#00d4aa',
                                            flexShrink: 0,
                                        }}
                                    >
                                        {i + 1}
                                    </span>
                                    <p style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: 1.5 }}>
                                        {t(key)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <Button
                            id="copy-questions-btn"
                            variant={questionsCopied ? 'primary' : 'secondary'}
                            size="sm"
                            fullWidth
                            onClick={handleCopyQuestions}
                            style={{ marginTop: '14px' }}
                        >
                            {questionsCopied ? `✅ ${t('questions_copied')}` : `📋 ${t('copy_questions')}`}
                        </Button>
                    </Card>
                )}
            </div>

            {/* ── Chat Area ───────────────────────── */}
            <div
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    minHeight: 'calc(100dvh - 200px - var(--nav-height))',
                    maxHeight: 'calc(100dvh - 200px - var(--nav-height))',
                }}
            >
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        style={{
                            display: 'flex',
                            justifyContent:
                                msg.role === 'user' ? 'flex-end' : 'flex-start',
                            animation: 'slideUp 0.3s ease',
                        }}
                    >
                        <div
                            style={{
                                maxWidth: '85%',
                                padding: '14px 16px',
                                borderRadius:
                                    msg.role === 'user'
                                        ? isRTL
                                            ? '16px 4px 16px 16px'
                                            : '16px 16px 4px 16px'
                                        : isRTL
                                            ? '4px 16px 16px 16px'
                                            : '16px 16px 16px 4px',
                                background:
                                    msg.role === 'user'
                                        ? 'linear-gradient(135deg, rgba(0, 212, 170, 0.2), rgba(99, 102, 241, 0.2))'
                                        : 'rgba(26, 34, 54, 0.7)',
                                border: `1px solid ${msg.role === 'user'
                                    ? 'rgba(0, 212, 170, 0.2)'
                                    : 'rgba(255, 255, 255, 0.06)'
                                    }`,
                            }}
                        >
                            {msg.role === 'assistant' && (
                                <p
                                    style={{
                                        fontSize: '11px',
                                        color: '#00d4aa',
                                        fontWeight: 700,
                                        marginBottom: '6px',
                                    }}
                                >
                                    🤖 Htech AI
                                </p>
                            )}
                            <p
                                style={{
                                    fontSize: '14px',
                                    lineHeight: 1.7,
                                    color: '#e2e8f0',
                                    whiteSpace: 'pre-wrap',
                                }}
                            >
                                {msg.text}
                            </p>
                            <p
                                style={{
                                    fontSize: '10px',
                                    color: '#475569',
                                    marginTop: '8px',
                                    textAlign: msg.role === 'user' ? 'end' : 'start',
                                }}
                            >
                                {new Date(msg.timestamp).toLocaleTimeString(
                                    language === 'ar' ? 'ar-SA' : 'en-US',
                                    { hour: '2-digit', minute: '2-digit' },
                                )}
                            </p>
                        </div>
                    </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <div
                            style={{
                                padding: '14px 20px',
                                borderRadius: isRTL ? '4px 16px 16px 16px' : '16px 16px 16px 4px',
                                background: 'rgba(26, 34, 54, 0.7)',
                                border: '1px solid rgba(255, 255, 255, 0.06)',
                                display: 'flex',
                                gap: '6px',
                                alignItems: 'center',
                            }}
                        >
                            {[0, 1, 2].map((i) => (
                                <span
                                    key={i}
                                    style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: '#00d4aa',
                                        animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div ref={chatEndRef} />
            </div>

            {/* ── Quick Suggestions ────────────────── */}
            {messages.length <= 1 && (
                <div
                    style={{
                        padding: '0 16px 12px',
                        display: 'flex',
                        gap: '8px',
                        overflowX: 'auto',
                    }}
                >
                    {suggestions.map((s) => (
                        <button
                            key={s}
                            onClick={() => {
                                setInput(s);
                            }}
                            style={{
                                padding: '8px 14px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: 500,
                                background: 'rgba(99, 102, 241, 0.1)',
                                color: '#a5b4fc',
                                border: '1px solid rgba(99, 102, 241, 0.2)',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s ease',
                                flexShrink: 0,
                            }}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}

            {/* ── Input Area ──────────────────────── */}
            <div
                style={{
                    padding: '12px 16px',
                    paddingBottom: `calc(var(--nav-height) + 12px)`,
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    background: 'rgba(10, 15, 28, 0.95)',
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'flex-end',
                }}
            >
                <textarea
                    id="chat-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t('type_question')}
                    rows={1}
                    style={{
                        flex: 1,
                        background: 'rgba(15, 22, 41, 0.8)',
                        borderRadius: '14px',
                        padding: '12px 16px',
                        resize: 'none',
                        maxHeight: '100px',
                        minHeight: '44px',
                        lineHeight: '1.5',
                    }}
                />
                <Button
                    id="send-btn"
                    variant="primary"
                    size="md"
                    disabled={!input.trim()}
                    onClick={handleSend}
                    style={{
                        borderRadius: '14px',
                        padding: '12px 18px',
                        flexShrink: 0,
                    }}
                >
                    {isRTL ? '↩️' : '➤'}
                </Button>
            </div>
        </div>
    );
}
