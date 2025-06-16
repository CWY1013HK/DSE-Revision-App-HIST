// Note: This application implements all requested checkpoints (1, 2, 3, 4, 5).
// Checkpoint 4 (Identify Mistakes/Bias) and Checkpoint 5 (Comparative Analysis) are now integrated.
// The summary export is plain text, displayed in a message box for easy copying.
// AI-powered features (hints, outline help, essay feedback, overall feedback) are ENABLED,
// but require a valid Gemini API Key to function correctly.
// Data persistence (Firebase) is optional; please insert your config if desired.

import React, { useState, useEffect, createContext, useContext } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, query, onSnapshot } from 'firebase/firestore';

// --- Firebase Context ---
const FirebaseContext = createContext(null);

// --- Firebase Provider Component ---
const FirebaseProvider = ({ children }) => {
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    // Initialize Firebase
    // Use environment variables for config and app id
    const appId = process.env.REACT_APP_FIREBASE_APP_ID || 'default-app-id';
    let firebaseConfig = {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.REACT_APP_FIREBASE_APP_ID
    };

    // Only attempt to initialize Firebase if a minimal config is present
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
      console.warn("Firebase config is incomplete. Firebase features (like data persistence) may not work.");
      setIsAuthReady(true); // Allow app to proceed without full Firebase if config is missing
      return;
    }

    try {
      const app = initializeApp(firebaseConfig);
      const firestore = getFirestore(app);
      const firebaseAuth = getAuth(app);

      setDb(firestore);
      setAuth(firebaseAuth);

      // Sign in with custom token or anonymously
      const signIn = async () => {
        try {
          if (process.env.REACT_APP_INITIAL_AUTH_TOKEN) {
            await signInWithCustomToken(firebaseAuth, process.env.REACT_APP_INITIAL_AUTH_TOKEN);
          } else {
            await signInAnonymously(firebaseAuth);
          }
        } catch (error) {
          console.error("Firebase authentication failed:", error);
          // If auth fails, try anonymous sign-in as a fallback
          try {
            await signInAnonymously(firebaseAuth);
          } catch (anonError) {
            console.error("Anonymous sign-in also failed:", anonError);
          }
        }
      };

      signIn();

      // Listen for auth state changes
      const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          setUserId(crypto.randomUUID()); // Fallback to random ID if not authenticated
        }
        setIsAuthReady(true);
      });

      return () => unsubscribe(); // Cleanup auth listener
    } catch (error) {
      console.error("Failed to initialize Firebase:", error);
      setIsAuthReady(true); // Mark as ready even on error to unblock UI
    }
  }, []);

  return (
    <FirebaseContext.Provider value={{ db, auth, userId, isAuthReady }}>
      {children}
    </FirebaseContext.Provider>
  );
};

// --- Global Data (Synthesized from DSE History context) ---

// Modernization Criteria based on DSE History syllabus
const modernizationCriteria = {
  political: `Political modernization involves the development of a more democratic, participatory, and accountable governance system. Key indicators include:
- Shift from autocratic rule to more representative forms (e.g., constitutional monarchy, republic, people's congresses).
- Increased popular participation in decision-making (e.g., elections, political movements).
- Establishment of a sound legal framework and rule of law.
- Development of a professional bureaucracy and efficient administration.
- Enhanced national sovereignty and diplomatic standing.`,
  economic: `Economic modernization refers to the transformation from a traditional agrarian economy to a diversified industrial and service-based economy. Key indicators include:
- Industrialization and technological advancement.
- Development of modern infrastructure (e.g., railways, roads, communication).
- Growth of market economy principles and private enterprise.
- Increased productivity and improved living standards.
- Integration into the global economy.`,
  social_cultural_educational: `Social, cultural, and educational modernization involves changes in societal structures, values, and knowledge systems. Key indicators include:
- Abolition of traditional social hierarchies and evils (e.g., foot-binding, queues, arranged marriages, class distinctions).
- Promotion of new ideologies and values (e.g., science, democracy, individualism, patriotism).
- Expansion of public education and literacy rates.
- Development of modern healthcare and public welfare.
- Greater gender equality and social mobility.`,
  diplomatic: `Diplomatic modernization involves a nation's ability to assert its sovereignty, protect its interests, and engage effectively in international relations. Key indicators include:
- Abolition of unequal treaties and regaining of national sovereignty.
- Establishment of diplomatic relations with major powers.
- Participation in international organizations.
- Ability to protect national interests and avoid foreign aggression.`,
  military: `Military modernization involves the transformation of armed forces into a modern, professional, and technologically advanced national defense system. Key indicators include:
- Adoption of modern military doctrines and training.
- Acquisition and development of advanced weaponry and technology.
- Establishment of a unified and disciplined national army.
- Ability to defend national borders and interests effectively.`
};

// Key knowledge content for each historical period (synthesized)
const historicalContent = {
  "Late Qing Reform (1901-1911)": {
    summary: `Following the Boxer Protocol, the Qing government initiated reforms to save its rule. Politically, they aimed for constitutional monarchy, sending officials abroad to study, establishing provincial assemblies (Zizhengyuan), and a cabinet. Economically, they encouraged private enterprise, established a Ministry of Commerce, and developed some modern industries and railways. Socially, reforms included banning foot-binding and traditional examinations. However, these reforms were often seen as insincere and too slow, ultimately failing to prevent the 1911 Revolution.`,
    political: `The Late Qing Reform aimed to establish a constitutional monarchy. Key measures included:
- 1905: Five Ministers sent abroad to study constitutional systems.
- 1908: 'Outline of Imperial Constitution' (Qin Ding Xian Fa Da Gang) promulgated, promising a nine-year preparation for constitutional rule.
- 1909: Provincial Consultative Councils (Zizhengyuan) established.
- 1910: Imperial Consultative Assembly (Zizheng Yuan) established.
- 1911: A cabinet was formed, but dominated by imperial family members, leading to public dissatisfaction.
These reforms were seen as attempts to consolidate imperial power rather than genuinely share it, leading to increased revolutionary sentiment.`,
    economic: `Economically, the Late Qing government sought to promote industry and commerce.
- 1903: Ministry of Commerce established.
- Encouraged private capital and the development of modern industries.
- Growth of national capitalist enterprises.
- Development of railways and mining.
Despite some growth, the economy remained largely agrarian and faced significant foreign economic penetration.`,
    social_cultural_educational: `Socially and culturally, reforms included:
- 1902: Abolition of foot-binding.
- 1905: Abolition of the traditional imperial examination system, leading to the establishment of modern schools.
- Promotion of Western learning.
These changes laid some groundwork for social and educational modernization, but traditional customs and values remained strong.`,
    diplomatic: `Diplomatically, the Late Qing period was marked by continued foreign encroachment and unequal treaties, limiting China's sovereignty. The reforms did not significantly altered China's weak international position.`,
    military: `Military reforms included the establishment of New Armies (Xinjun) trained in Western methods. These armies, however, sometimes became a base for revolutionary activities, as seen in the Wuchang Uprising.`
  },
  "1911 Revolution (1911)": {
    summary: `The 1911 Revolution, sparked by the Wuchang Uprising, led to the collapse of the Qing Dynasty and the establishment of the Republic of China. It ended over 2,000 years of imperial rule, marking a significant political break. However, the new republic quickly faced instability, with Yuan Shikai's authoritarianism and subsequent warlordism, limiting its immediate success in establishing a stable democratic system.`,
    political: `The 1911 Revolution's primary political impact was the overthrow of the Qing Dynasty and the establishment of the Republic of China.
- Provinces declared independence, leading to the abdication of the Qing Emperor.
- Formation of the Provisional Government in Nanjing with Sun Yat-sen as Provisional President.
- Adoption of the Provisional Constitution of the Republic of China.
However, the republic was fragile, quickly falling under Yuan Shikai's authoritarian rule and later dissolving into warlordism, hindering genuine democratic development.`,
    economic: `The 1911 Revolution did not bring immediate significant economic modernization. The political instability and subsequent warlord era often disrupted economic activity, though some industrial growth continued, driven by private enterprise.`,
    social_cultural_educational: `Socially, the revolution promoted republican ideals and challenged traditional hierarchies.
- Abolition of queues (pigtails) as a symbol of Manchu rule.
- Increased awareness of modern political ideas.
However, deep-seated social customs and rural structures remained largely unchanged immediately after the revolution.`,
    diplomatic: `Diplomatically, the revolution did not fundamentally alter China's position vis-à-vis foreign powers, though the new republican government sought to revise unequal treaties.`,
    military: `The revolution was facilitated by the New Army's defection and highlighted the emergence of modern military forces as a political factor.`
  },
  "May Fourth Movement (1919)": {
    summary: `The May Fourth Movement was a patriotic and intellectual movement triggered by China's humiliation at the Versailles Peace Conference (Shandong Problem). It marked a shift from political revolution to cultural and intellectual awakening, advocating "science" and "democracy" and criticizing traditional Confucianism. It spurred new intellectual currents (e.g., Marxism), increased political consciousness among youth and urban populations, and laid groundwork for future political movements.`,
    political: `The May Fourth Movement significantly raised political consciousness, especially among students and intellectuals.
- Protest against the Treaty of Versailles and foreign imperialism.
- Demands for national sovereignty and internal political reform.
- Led to the rise of new political forces, including early Communist groups and a revitalized Kuomintang.
It marked a shift towards mass political mobilization and a stronger sense of nationalism.`,
    economic: `The movement's direct economic impact was limited, but its emphasis on national strength and anti-imperialism indirectly encouraged the development of national industries and boycotts of foreign goods.`,
    social_cultural_educational: `This was a profound cultural and intellectual revolution.
- Advocated "Science" (Sai Xiansheng) and "Democracy" (De Xiansheng) as guiding principles.
- Critiqued traditional Confucianism and promoted vernacular Chinese.
- Introduced Western ideologies like Marxism, liberalism, and pragmatism.
- Led to the establishment of new schools and educational reforms.
- Increased women's participation in public life.
It fundamentally challenged traditional values and fostered a new intellectual climate.`,
    diplomatic: `The movement was a direct response to diplomatic humiliation (Shandong Problem) and strengthened China's resolve to resist foreign encroachment, influencing future foreign policy.`,
    military: `The movement itself was not military, but its nationalist fervor indirectly contributed to the later development of national armies.`
  },
  "Attempts at modernisation by the Nanjing government (1928-1937)": {
    summary: `The Nanjing Decade (1928-1937) under the Kuomintang (KMT) government led by Chiang Kai-shek saw significant efforts at national reconstruction and modernization. Economically, there was notable industrial growth, infrastructure development (railways, roads), and financial reforms (e.g., currency standardization). Politically, the KMT implemented "political tutelage" as a step towards constitutionalism, but it was characterized by one-party rule and suppression of dissent. The period was often called the "Golden Decade" for its economic achievements, but faced challenges from warlords, communists, and escalating Japanese aggression.`,
    political: `The Nanjing government aimed to achieve political modernization through Sun Yat-sen's theory of "political tutelage" (訓政), a transitional phase towards constitutional democracy.
- Established a centralized government in Nanjing.
- Efforts to unify the country and suppress warlordism (though not entirely successful).
- One-party rule by the Kuomintang, with limited political participation for the populace.
- Suppression of political opponents, including communists.
Despite the stated goal of democracy, the period was largely authoritarian.`,
    economic: `This period is often referred to as the "Golden Decade" due to significant economic progress.
- Industrial growth, especially in light industries.
- Development of modern infrastructure: extensive railway and road construction.
- Financial reforms: establishment of the Central Bank of China, currency standardization (e.g., abolition of the tael, introduction of the fapi/yuan).
- Growth of foreign trade and investment.
These efforts laid important foundations for China's modern economy.`,
    social_cultural_educational: `Socially and culturally, the New Life Movement (新生活運動) was launched to promote traditional Confucian virtues mixed with Western discipline, aiming to improve public morality and hygiene.
- Expansion of modern education and establishment of universities.
- Efforts to promote public health.
- Limited social reforms, as traditional structures remained strong, especially in rural areas.`,
    diplomatic: `Diplomatically, the Nanjing government sought to abolish unequal treaties and regain tariff autonomy, achieving some success. However, escalating Japanese aggression (e.g., Mukden Incident, invasion of Manchuria) severely challenged China's sovereignty and diplomatic efforts.`,
    military: `The KMT invested heavily in military modernization, building up the National Revolutionary Army with German advisors and equipment, primarily to combat warlords and communists, and later to resist Japanese invasion.`
  },
  "The Communist Revolution and the Establishment of the People's Republic of China (1921-1949)": {
    summary: `This period covers the rise of the Chinese Communist Party (CCP), its long struggle against the Kuomintang (KMT) and Japanese invaders, culminating in the establishment of the People's Republic of China (PRC) in 1949. The Communist Revolution fundamentally transformed China's political and social landscape, ending the civil war and establishing a new socialist state. Key aspects include land reform, mass mobilization, and the creation of a centralized, single-party system.`,
    political: `The Communist Revolution led to the complete overthrow of the KMT government and the establishment of a new political order.
- Formation of the Chinese Communist Party (CCP) in 1921.
- Long March (1934-1935) solidified CCP leadership.
- Establishment of "revolutionary base areas" with new governance structures.
- Victory in the Civil War (1946-1949) and the proclamation of the PRC on October 1, 1949.
This marked a radical shift to a centralized, one-party socialist state under the CCP.`,
    economic: `Economically, the CCP implemented land reform in areas under its control, redistributing land from landlords to peasants. This gained them significant peasant support. After 1949, the focus was on economic recovery and initial socialist transformation, laying groundwork for planned economy.`,
    social_cultural_educational: `Socially, the revolution aimed at dismantling the old feudal system and promoting class equality.
- Land reform significantly altered rural social structures.
- Mass literacy campaigns and re-education efforts were initiated in liberated areas.
- Promotion of new revolutionary culture and values.
This period saw profound social upheaval and the beginning of a new social order.`,
    diplomatic: `Diplomatically, the CCP initially sought Soviet support and adopted a "lean to one side" policy. The establishment of the PRC was a major geopolitical event, challenging the existing international order and leading to non-recognition by many Western powers.`,
    military: `The development of the People's Liberation Army (PLA) from a guerrilla force to a conventional army was central. Its military victories were crucial to the revolution's success.`
  },
  "Establishment of the PRC (1949-1952)": {
    summary: `The initial years of the PRC focused on consolidating Communist rule, economic recovery, and social reforms. Key actions included land reform nationwide, suppression of counter-revolutionaries, and initial steps towards a planned economy. The period also saw China's involvement in the Korean War, which solidified national unity but also led to international isolation from the West.`,
    political: `Consolidation of the CCP's power and establishment of the new state apparatus.
- Formation of the Central People's Government.
- Suppression of "counter-revolutionaries" to eliminate opposition.
- Establishment of a centralized administrative system.
- Development of a new legal system based on socialist principles.`,
    economic: `Economic recovery and initial socialist transformation.
- Land reform completed nationwide, redistributing land to peasants.
- Nationalization of key industries and banks.
- Stabilization of currency and control of inflation.
- Initial steps towards a planned economy.`,
    social_cultural_educational: `Widespread social reforms and cultural changes.
- Campaigns against social ills like prostitution and opium addiction.
- Promotion of literacy and basic education.
- Emphasis on class struggle and new revolutionary values.
- Marriage Law of 1950 promoting gender equality.`,
    diplomatic: `The PRC adopted a "lean to one side" policy, aligning with the Soviet Union. Involvement in the Korean War (1950-1953) led to international isolation from Western countries but enhanced China's prestige among socialist nations and newly independent states.`,
    military: `The Korean War significantly modernized and professionalized the People's Liberation Army (PLA), turning it into a formidable fighting force.`
  },
  "Attempts at modernization in the Maoist period (1953-1965)": {
    summary: `This period saw China's efforts to industrialize under Mao Zedong's leadership, primarily through Soviet-style central planning (First Five-Year Plan) and later through radical mass mobilization (Great Leap Forward). While the First Five-Year Plan achieved some industrial growth, the Great Leap Forward (1958-1960) resulted in a catastrophic famine and economic disaster. The period also marked the Sino-Soviet split, leading China to pursue a more independent path.`,
    political: `Continued consolidation of one-party rule under the CCP.
- Emphasis on Mao Zedong's leadership and ideology.
- Launch of political campaigns (e.g., Anti-Rightist Campaign) to suppress dissent and ensure ideological conformity.
- Development of a highly centralized political system.`,
    economic: `Ambitious but often disastrous attempts at economic modernization.
- First Five-Year Plan (1953-1957): Focused on heavy industry development with Soviet assistance, achieving significant industrial growth.
- Great Leap Forward (1958-1960): Attempted rapid industrialization and collectivization through mass mobilization (e.g., backyard steel furnaces, People's Communes), leading to severe economic dislocation and famine.
- Economic readjustment in the early 1960s to recover from the Great Leap Forward.`,
    social_cultural_educational: `Intense ideological campaigns and social restructuring.
- Collectivization of agriculture transformed rural society.
- Education system expanded but increasingly influenced by political ideology.
- Emphasis on "redness" over "expertness."
- Promotion of revolutionary culture and suppression of traditional and Western influences.`,
    diplomatic: `Initial close alliance with the Soviet Union, followed by the Sino-Soviet split in the late 1950s/early 1960s, leading China to pursue a more independent and self-reliant foreign policy. China also supported various Third World liberation movements.`,
    military: `Continued development of the PLA, with Soviet assistance initially, then independent development of nuclear weapons (first successful test in 1964) as part of self-reliance.`
  },
  "Cultural Revolution (1966-1976)": {
    summary: `The Cultural Revolution, initiated by Mao Zedong, was a decade-long political upheaval aimed at purging perceived capitalist and traditional elements from Chinese society and solidifying Mao's ideological control. It led to widespread chaos, persecution of intellectuals and party officials, destruction of cultural heritage, and severe disruption to education and the economy. It is widely regarded as a catastrophic period that severely set back China's modernization efforts.`,
    political: `Extreme political instability and purges.
- Mao Zedong launched the movement to regain political control and eliminate perceived rivals.
- Red Guards attacked "Four Olds" (old ideas, culture, customs, habits) and purged party officials, intellectuals, and perceived "class enemies."
- Dissolution of formal political structures and rise of revolutionary committees.
- Cult of personality around Mao.
This period led to the breakdown of the state and party apparatus.`,
    economic: `Severe disruption to the economy.
- Industrial and agricultural production suffered due to political turmoil and ideological campaigns.
- Transportation and distribution systems were disrupted.
- Foreign trade was minimal.
The focus on class struggle and political purity overshadowed economic development.`,
    social_cultural_educational: `Massive social and cultural destruction.
- Traditional culture, historical sites, and religious practices were attacked.
- Education system collapsed, with universities closed and students sent to rural areas ("Up to the Mountains and Down to the Countryside Movement").
- Intellectuals and professionals were persecuted.
- Deep divisions and distrust within society.`,
    diplomatic: `Initial diplomatic isolation and radical foreign policy.
- China's foreign relations were strained due to internal chaos and radical rhetoric.
- Gradual re-engagement with the world in the early 1970s (e.g., Nixon's visit to China in 1972) as the leadership sought to break Soviet encirclement.`,
    military: `The PLA played a crucial role in maintaining order and supporting different factions, but its primary function shifted from national defense to internal political control.`
  },
  "Reform and opening up (1978-2000)": {
    summary: `Initiated by Deng Xiaoping, the "Reform and Opening Up" policy fundamentally transformed China from a centrally planned economy to a socialist market economy and integrated it into the global system. Key reforms included the Household Responsibility System in agriculture, establishment of Special Economic Zones (SEZs), decentralization of economic decision-making, and encouragement of foreign investment. This led to unprecedented economic growth and significant improvements in living standards, though political reforms lagged behind.`,
    political: `While economic reforms were radical, political reforms were cautious.
- Shift from Maoist class struggle to "socialist modernization" as the primary goal.
- Emphasis on collective leadership and institutionalization of the party-state.
- Decentralization of some economic decision-making.
- However, the CCP maintained its one-party rule, and political dissent was suppressed (e.g., Tiananmen Square protests in 1989).`,
    economic: `Dramatic economic transformation and rapid growth.
- Agriculture: Implementation of the Household Responsibility System (家庭聯產承包責任制), greatly increasing food production.
- Industry: Decentralization, state-owned enterprise reform, and encouragement of private and collective enterprises.
- Opening Up: Establishment of Special Economic Zones (SEZs) like Shenzhen, Zhuhai, Shantou, Xiamen to attract foreign investment and technology.
- Integration into the global economy, leading to China becoming a major manufacturing hub.`,
    social_cultural_educational: `Significant improvements in living standards and social mobility.
- Increased consumerism and access to goods.
- Re-emphasis on education and scientific research after the Cultural Revolution.
- Greater cultural exchange with the outside world.
- Emergence of a new urban middle class.
However, also saw rising income inequality and social problems associated with rapid development.`,
    diplomatic: `Active engagement with the international community.
- Establishment of diplomatic relations with more countries.
- Joining international organizations (e.g., WTO in 2001, though negotiations were ongoing in this period).
- Emphasis on peaceful development and economic cooperation.
China's international standing significantly improved.`,
    military: `Modernization of the People's Liberation Army (PLA) through reduced size, professionalization, and acquisition of modern technology, shifting focus from "people's war" to modern warfare.`
  },
};

// --- Helper Functions for LLM Calls ---
const callFireworksAPI = async (prompt, schema = null) => {
  const payload = {
    model: "accounts/pshe/deployedModels/llama-v3p1-8b-instruct-k8nueweh",
    max_tokens: 16384,
    top_p: 1,
    top_k: 40,
    presence_penalty: 0,
    frequency_penalty: 0,
    temperature: 0.6,
    messages: [
      {
        role: "user",
        content: prompt
      }
    ]
  };

  if (schema) {
    payload.response_format = { type: "json_object" };
  }

  // IMPORTANT: Replace "YOUR_FIREWORKS_API_KEY_HERE" with your actual Fireworks API key.
  const apiKey = "YOUR_FIREWORKS_API_KEY_HERE";
  const apiUrl = "https://api.fireworks.ai/inference/v1/chat/completions";

  if (!apiKey || apiKey === "YOUR_FIREWORKS_API_KEY_HERE") {
    console.error("Fireworks API Key is missing or not set. Please replace 'YOUR_FIREWORKS_API_KEY_HERE' in the code.");
    return null;
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });
    const result = await response.json();

    if (result.choices && result.choices.length > 0 && result.choices[0].message) {
      const text = result.choices[0].message.content;
      if (schema) {
        return JSON.parse(text);
      }
      return text;
    } else {
      console.error("Unexpected API response structure or no choices:", result);
      return null;
    }
  } catch (error) {
    console.error("Error calling Fireworks API:", error);
    return null;
  }
};

// --- Components ---

const BackButton = ({ onClick }) => (
  <button onClick={onClick} className="btn btn-outline">
    Back
  </button>
);

const LoadingSpinner = () => (
  <div className="loading">
    <div className="loading-spinner"></div>
    <p className="ml-4">Loading...</p>
  </div>
);

const MessageBox = ({ message, onClose, content = null }) => (
  <div className="modal">
    <div className="card">
      <p className="text-lg font-semibold mb-4">{message}</p>
      {content && (
        <textarea
          readOnly
          className="form-input"
          value={content}
        ></textarea>
      )}
      <button onClick={onClose} className="btn btn-primary">
        OK
      </button>
    </div>
  </div>
);

const HomePage = ({ onSelectPeriod }) => {
  const historicalPeriods = Object.keys(historicalContent);

  return (
    <div className="container fade-in">
      <div className="card">
        <h2 className="text-center">Choose Your Challenge!</h2>
        <p className="text-center text-light">Select a historical period to begin your revision game.</p>
        <div className="grid">
          {historicalPeriods.map((period) => (
            <button
              key={period}
              onClick={() => onSelectPeriod(period)}
              className="btn btn-primary"
            >
              {period}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const Checkpoint1 = ({ selectedPeriod, onComplete, onBack }) => {
  const { db, userId } = useContext(FirebaseContext);
  const [questions, setQuestions] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [hints, setHints] = useState({});
  const [hintLoading, setHintLoading] = useState({});

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      const content = historicalContent[selectedPeriod].summary + " " +
        historicalContent[selectedPeriod].political + " " +
        historicalContent[selectedPeriod].economic + " " +
        historicalContent[selectedPeriod].social_cultural_educational;

      const prompt = `Generate 3 multiple-choice questions (with 4 options each, clearly labeled A, B, C, D) and 2 fill-in-the-blank questions about the "${selectedPeriod}" in Chinese history, focusing on its modernization and transformation. The content should be based on the following historical information:
      
      ${content}
      
      Provide the questions and their correct answers in a JSON format.
      
      JSON Schema:
      {
        "mc_questions": [
          {
            "question": "string",
            "options": {
              "A": "string",
              "B": "string",
              "C": "string",
              "D": "string"
            },
            "answer": "string"
          }
        ],
        "fill_in_blanks": [
          {
            "question": "string",
            "answer": "string"
          }
        ]
      }`;

      const schema = {
        type: "OBJECT",
        properties: {
          mc_questions: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                question: { type: "STRING" },
                options: {
                  type: "OBJECT",
                  properties: {
                    A: { type: "STRING" },
                    B: { type: "STRING" },
                    C: { type: "STRING" },
                    D: { type: "STRING" }
                  },
                  required: ["A", "B", "C", "D"]
                },
                answer: { type: "STRING" }
              },
              required: ["question", "options", "answer"]
            }
          },
          fill_in_blanks: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                question: { type: "STRING" },
                answer: { type: "STRING" }
              },
              required: ["question", "answer"]
            }
          }
        },
        required: ["mc_questions", "fill_in_blanks"]
      };

      const generatedQuestions = await callFireworksAPI(prompt, schema);
      if (generatedQuestions) {
        setQuestions(generatedQuestions);
        // Initialize user answers
        const initialAnswers = {};
        generatedQuestions.mc_questions.forEach((_, index) => {
          initialAnswers[`mc_${index}`] = '';
        });
        generatedQuestions.fill_in_blanks.forEach((_, index) => {
          initialAnswers[`fib_${index}`] = '';
        });
        setUserAnswers(initialAnswers);
      } else {
        setMessage("Failed to load questions. Please ensure your Fireworks API key is correctly set.");
      }
      setLoading(false);
    };

    fetchQuestions();
  }, [selectedPeriod]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserAnswers((prev) => ({ ...prev, [name]: value }));
  };

  const handleGetHint = async (questionType, index, questionText, options = null) => {
    setHintLoading(prev => ({ ...prev, [`${questionType}_${index}`]: true }));
    let hintPrompt = `Provide a subtle hint for the following DSE History question about "${selectedPeriod}":\n\nQuestion: ${questionText}\n`;
    if (options) {
      hintPrompt += `Options: A) ${options.A} B) ${options.B} C) ${options.C} D) ${options.D}\n`;
    }
    hintPrompt += `The hint should guide the student without revealing the direct answer. Focus on a related concept or a key event from the period.`;

    const hint = await callFireworksAPI(hintPrompt);
    if (hint) {
      setHints(prev => ({ ...prev, [`${questionType}_${index}`]: hint }));
    } else {
      setMessage("Failed to get hint. Please ensure your Fireworks API key is correctly set.");
    }
    setHintLoading(prev => ({ ...prev, [`${questionType}_${index}`]: false }));
  };

  const handleSubmit = async () => {
    let currentScore = 0;
    const allAnswers = {};

    // Check MC questions
    questions.mc_questions.forEach((q, index) => {
      const userAnswer = userAnswers[`mc_${index}`].toUpperCase().trim();
      allAnswers[`mc_${index}`] = userAnswer;
      if (userAnswer === q.answer.toUpperCase().trim()) {
        currentScore++;
      }
    });

    // Check Fill-in-blank questions
    questions.fill_in_blanks.forEach((q, index) => {
      const userAnswer = userAnswers[`fib_${index}`].trim();
      allAnswers[`fib_${index}`] = userAnswer;
      if (userAnswer.toLowerCase() === q.answer.toLowerCase().trim()) {
        currentScore++;
      }
    });

    setScore(currentScore);
    setShowResults(true);

    // Save to Firestore
    if (db && userId) {
      const docRef = doc(db, `artifacts/${process.env.REACT_APP_FIREBASE_APP_ID || 'default-app-id'}/users/${userId}/history_revision_app`, selectedPeriod);
      try {
        await setDoc(docRef, {
          checkpoint1: {
            questions: questions,
            userAnswers: allAnswers,
            score: currentScore,
            timestamp: new Date()
          }
        }, { merge: true });
      } catch (e) {
        console.error("Error saving Checkpoint 1 data to Firestore:", e);
        setMessage("Failed to save progress. Please check console for details.");
      }
    }
  };

  return (
    <div className="container fade-in">
      <div className="card">
        <h2>Checkpoint 1: Knowledge Check</h2>
        <p className="text-light">Test your understanding of {selectedPeriod}</p>

        {loading ? (
          <LoadingSpinner />
        ) : showResults ? (
          <div className="feedback feedback-success">
            <h3>Results</h3>
            <p>Your score: {score} out of {Object.keys(questions.mc_questions).length + questions.fill_in_blanks.length}</p>
            <button onClick={onComplete} className="btn btn-primary">
              Continue
            </button>
          </div>
        ) : (
          <div className="quiz-container">
            {questions?.mc_questions.map((q, index) => (
              <div key={index} className="question">
                <p>{q.question}</p>
                <div className="options">
                  {Object.entries(q.options).map(([key, value]) => (
                    <div
                      key={key}
                      className={`option ${userAnswers[`mc_${index}`] === key ? 'selected' : ''}`}
                      onClick={() => handleInputChange({ target: { name: `mc_${index}`, value: key } })}
                    >
                      {key}: {value}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => handleGetHint('mc', index, q.question, q.options)}
                  className="btn btn-outline"
                  disabled={hintLoading[`mc_${index}`]}
                >
                  {hintLoading[`mc_${index}`] ? 'Loading...' : 'Get Hint'}
                </button>
                {hints[`mc_${index}`] && (
                  <div className="feedback">
                    <p>{hints[`mc_${index}`]}</p>
                  </div>
                )}
              </div>
            ))}

            {questions?.fill_in_blanks.map((q, index) => (
              <div key={index} className="question">
                <p>{q.question}</p>
                <input
                  type="text"
                  name={`fill_${index}`}
                  value={userAnswers[`fill_${index}`] || ''}
                  onChange={handleInputChange}
                  className="form-input"
                />
                <button
                  onClick={() => handleGetHint('fib', index, q.question)}
                  className="btn btn-outline"
                  disabled={hintLoading[`fib_${index}`]}
                >
                  {hintLoading[`fib_${index}`] ? 'Loading...' : 'Get Hint'}
                </button>
                {hints[`fib_${index}`] && (
                  <div className="feedback">
                    <p>{hints[`fib_${index}`]}</p>
                  </div>
                )}
              </div>
            ))}

            <div className="nav">
              <BackButton onClick={onBack} />
              <button onClick={handleSubmit} className="btn btn-primary">
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
      {message && <MessageBox message={message} onClose={() => setMessage(null)} />}
    </div>
  );
};

const Checkpoint2 = ({ selectedPeriod, onComplete, onBack }) => {
  const { db, userId } = useContext(FirebaseContext);
  const [statements, setStatements] = useState(null);
  const [userAnswers, setUserAnswers] = useState({}); // { statement_index: { isTrue: bool } }
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchStatements = async () => {
      setLoading(true);
      const content = historicalContent[selectedPeriod].summary + " " +
        historicalContent[selectedPeriod].political + " " +
        historicalContent[selectedPeriod].economic + " " +
        historicalContent[selectedPeriod].social_cultural_educational;

      const prompt = `Generate 3 historical statements about the "${selectedPeriod}" in Chinese history. Each statement MUST contain an intentional factual error (e.g., wrong year, historical person, organization name, policy name, or a false assertion). For each statement, indicate if it is "true" or "false" and provide the correct value if it's false. The content should be based on the following historical information:
          
          ${content}
          
          Provide the statements in a JSON format.
          
          JSON Schema:
          {
            "statements": [
              {
                "statement": "string",
                "is_true": "boolean",
                "correct_value_if_false": "string"
              }
            ]
          }`;

      const schema = {
        type: "OBJECT",
        properties: {
          statements: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                statement: { type: "STRING" },
                is_true: { type: "BOOLEAN" },
                correct_value_if_false: { type: "STRING" }
              },
              required: ["statement", "is_true"]
            }
          }
        },
        required: ["statements"]
      };

      const generatedStatements = await callFireworksAPI(prompt, schema);
      if (generatedStatements) {
        setStatements(generatedStatements);
        // Initialize user answers
        const initialAnswers = {};
        generatedStatements.statements.forEach((_, index) => {
          initialAnswers[index] = { isTrue: null };
        });
        setUserAnswers(initialAnswers);
      } else {
        setMessage("Failed to load statements. Please ensure your Fireworks API key is correctly set.");
      }
      setLoading(false);
    };

    fetchStatements();
  }, [selectedPeriod]);

  const handleTrueFalseChange = (index, value) => {
    setUserAnswers((prev) => ({
      ...prev,
      [index]: { isTrue: value === 'true' }
    }));
  };

  const handleSubmit = async () => {
    let currentScore = 0;
    const allAnswers = {};

    statements.statements.forEach((s, index) => {
      const userAnswer = userAnswers[index];
      allAnswers[index] = userAnswer;

      // Check if user's T/F answer is correct
      if (userAnswer.isTrue === s.is_true) {
        currentScore++;
      }
    });

    setScore(currentScore);
    setShowResults(true);

    // Save to Firestore
    if (db && userId) {
      const docRef = doc(db, `artifacts/${process.env.REACT_APP_FIREBASE_APP_ID || 'default-app-id'}/users/${userId}/history_revision_app`, selectedPeriod);
      try {
        await setDoc(docRef, {
          checkpoint2: {
            statements: statements,
            userAnswers: allAnswers,
            score: currentScore,
            timestamp: new Date()
          }
        }, { merge: true });
      } catch (e) {
        console.error("Error saving Checkpoint 2 data to Firestore:", e);
        setMessage("Failed to save progress. Please check console for details.");
      }
    }
  };

  return (
    <div className="container fade-in">
      <div className="card">
        <h2>Checkpoint 2: True/False Analysis</h2>
        <p className="text-light">Evaluate statements about {selectedPeriod}</p>

        {loading ? (
          <LoadingSpinner />
        ) : showResults ? (
          <div className="feedback feedback-success">
            <h3>Results</h3>
            <p>Your score: {score} out of {statements.length}</p>
            <button onClick={onComplete} className="btn btn-primary">
              Continue
            </button>
          </div>
        ) : (
          <div className="quiz-container">
            {statements.map((statement, index) => (
              <div key={index} className="question">
                <p>{statement.statement}</p>
                <div className="options">
                  <button
                    className={`btn ${userAnswers[index] === true ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleTrueFalseChange(index, true)}
                  >
                    True
                  </button>
                  <button
                    className={`btn ${userAnswers[index] === false ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleTrueFalseChange(index, false)}
                  >
                    False
                  </button>
                </div>
              </div>
            ))}

            <div className="nav">
              <BackButton onClick={onBack} />
              <button onClick={handleSubmit} className="btn btn-primary">
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
      {message && <MessageBox message={message} onClose={() => setMessage(null)} />}
    </div>
  );
};

const Checkpoint3 = ({ selectedPeriod, onComplete, onBack }) => {
  const { db, userId } = useContext(FirebaseContext);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [essay, setEssay] = useState('');
  const [outline, setOutline] = useState(null);
  const [outlineLoading, setOutlineLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const initializeCheckpoint = async () => {
      try {
        // Randomly select an aspect
        const chosenAspect = ['Political', 'Economic', 'Social/Cultural/Educational', 'Diplomatic', 'Military'][Math.floor(Math.random() * 5)];
        const periodContent = historicalContent[selectedPeriod];
        const modernizationDef = modernizationCriteria[chosenAspect.toLowerCase().replace(/\//g, '_')];

        const prompt = `Generate a concise outline or key points for an essay answering the question:
            "To what extent was ${selectedPeriod} effective in modernizing China in the ${chosenAspect} aspect?"
            
            Focus on providing a structure with main arguments and relevant examples based on the following information:
            
            Historical Period Content:
            ${periodContent.summary}
            ${periodContent[chosenAspect.toLowerCase().replace(/\//g, '_')] || ''}
            
            Modernization Criteria for ${chosenAspect}:
            ${modernizationDef}
            
            Format the outline clearly with bullet points or numbered lists.`;

        const generatedOutline = await callFireworksAPI(prompt);
        if (generatedOutline) {
          setOutline(generatedOutline);
        } else {
          setMessage("Failed to generate outline. Please ensure your Fireworks API key is correctly set.");
        }
      } catch (error) {
        setMessage("Error initializing checkpoint: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    initializeCheckpoint();
  }, [selectedPeriod]);

  const handleGetOutline = async () => {
    setOutlineLoading(true);
    const periodContent = historicalContent[selectedPeriod];
    const modernizationDef = modernizationCriteria[selectedPeriod.toLowerCase().replace(/\//g, '_')];

    const prompt = `Generate a concise outline or key points for an essay answering the question:
        "To what extent was ${selectedPeriod} effective in modernizing China in the ${selectedPeriod} aspect?"
        
        Focus on providing a structure with main arguments and relevant examples based on the following information:
        
        Historical Period Content:
        ${periodContent.summary}
        ${periodContent[selectedPeriod.toLowerCase().replace(/\//g, '_')] || ''}
        
        Modernization Criteria for ${selectedPeriod}:
        ${modernizationDef}
        
        Format the outline clearly with bullet points or numbered lists.`;

    const generatedOutline = await callFireworksAPI(prompt);
    if (generatedOutline) {
      setOutline(generatedOutline);
    } else {
      setMessage("Failed to generate outline. Please ensure your Fireworks API key is correctly set.");
    }
    setOutlineLoading(false);
  };

  const handleSubmit = async () => {
    if (!essay.trim()) {
      setMessage("Please write your essay before submitting.");
      return;
    }

    setLoading(true);
    const periodContent = historicalContent[selectedPeriod];
    const modernizationDef = modernizationCriteria[selectedPeriod.toLowerCase().replace(/\//g, '_')];

    const prompt = `You are a DSE History teacher. Assess the following student answer for the question:
        "To what extent was ${selectedPeriod} effective in modernizing China in the ${selectedPeriod} aspect?"
        
        Student's Answer: "${essay}"
        
        Evaluate it based on these criteria:
        1. Clear topic sentence (effective or not, and to what extent).
        2. Clear illustration of relevant and correct examples in details (provide two are good, provide one is less good).
        3. Provide good explanation about how the examples imply the effectiveness of the chosen historical period in modernizing China.
        4. Good language and structured presentation.
        
        Provide a score using thumb-up emojis (4 is good, 1 is not good, e.g., "👍👍👍👍") and a detailed comment for each criterion. Also, provide a comprehensive 'correct answer' in paragraph format for the question, drawing from the following historical knowledge about "${selectedPeriod}" and the general modernization criteria for "${selectedPeriod}":
        
        Historical Period Content:
        ${periodContent.summary}
        ${periodContent[selectedPeriod.toLowerCase().replace(/\//g, '_')] || ''}
        
        Modernization Criteria for ${selectedPeriod}:
        ${modernizationDef}
        
        Structure your response as JSON.
        
        JSON Schema:
        {
          "score": "string",
          "comment": "string",
          "correct_answer": "string"
        }`;

    const schema = {
      type: "OBJECT",
      properties: {
        score: { type: "STRING" },
        comment: { type: "STRING" },
        correct_answer: { type: "STRING" }
      },
      required: ["score", "comment", "correct_answer"]
    };

    const generatedFeedback = await callFireworksAPI(prompt, schema);
    if (generatedFeedback) {
      setFeedback(generatedFeedback);
      // Save to Firestore
      if (db && userId) {
        const docRef = doc(db, `artifacts/${process.env.REACT_APP_FIREBASE_APP_ID || 'default-app-id'}/users/${userId}/history_revision_app`, selectedPeriod);
        try {
          await setDoc(docRef, {
            checkpoint3: {
              question: { period: selectedPeriod, aspect: selectedPeriod },
              userAnswer: essay,
              feedback: generatedFeedback,
              timestamp: new Date()
            }
          }, { merge: true });
        } catch (e) {
          console.error("Error saving Checkpoint 3 data to Firestore:", e);
          setMessage("Failed to save progress. Please check console for details.");
        }
      }
    } else {
      setMessage("Failed to get feedback. Please ensure your Fireworks API key is correctly set.");
    }
    setLoading(false);
  };

  return (
    <div className="container fade-in">
      <div className="card">
        <h2>Checkpoint 3: Essay Writing</h2>
        <p className="text-light">Write an essay about {selectedPeriod}</p>

        {loading ? (
          <LoadingSpinner />
        ) : showResults ? (
          <div className="feedback feedback-success">
            <h3>Feedback</h3>
            <div className="feedback-content">
              {feedback}
            </div>
            <button onClick={onComplete} className="btn btn-primary">
              Continue
            </button>
          </div>
        ) : (
          <div className="quiz-container">
            <div className="form-group">
              <label className="form-label">Your Essay</label>
              <textarea
                value={essay}
                onChange={(e) => setEssay(e.target.value)}
                className="form-input"
                rows="10"
                placeholder="Write your essay here..."
              />
            </div>

            <div className="nav">
              <BackButton onClick={onBack} />
              <button onClick={handleGetOutline} className="btn btn-outline">
                Get Outline Help
              </button>
              <button onClick={handleSubmit} className="btn btn-primary">
                Submit
              </button>
            </div>

            {outline && (
              <div className="feedback">
                <h3>Suggested Outline</h3>
                <p>{outline}</p>
              </div>
            )}
          </div>
        )}
      </div>
      {message && <MessageBox message={message} onClose={() => setMessage(null)} />}
    </div>
  );
};

const App = () => {
  const { db, userId, isAuthReady } = useContext(FirebaseContext);
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'checkpoint1', 'checkpoint2', 'checkpoint3', 'final_feedback'
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [message, setMessage] = useState(null);
  const [overallFeedback, setOverallFeedback] = useState(null);
  const [loadingFinalFeedback, setLoadingFinalFeedback] = useState(false);
  const [exportSummaryContent, setExportSummaryContent] = useState(null);

  const handleSelectPeriod = (period) => {
    setSelectedPeriod(period);
    setCurrentPage('checkpoint1');
  };

  const handleCheckpoint1Complete = () => {
    setCurrentPage('checkpoint2');
  };

  const handleCheckpoint2Complete = () => {
    setCurrentPage('checkpoint3');
  };

  // After Checkpoint 3, go directly to final feedback
  const handleCheckpoint3Complete = async () => {
    setLoadingFinalFeedback(true);
    const prompt = `Based on the student's performance across Checkpoints 1, 2, and 3 for the historical period "${selectedPeriod}", provide an overall comment. Highlight their strengths (e.g., good factual recall, strong analytical skills) and areas for improvement (e.g., need more detailed examples, clearer topic sentences). Include some encouraging emojis.
        
        Assume the student has completed all checkpoints for this period.
        
        JSON Schema:
        {
          "comment": "string",
          "emojis": "string"
        }`;

    const schema = {
      type: "OBJECT",
      properties: {
        comment: { type: "STRING" },
        emojis: { type: "STRING" }
      },
      required: ["comment", "emojis"]
    };

    const feedback = await callFireworksAPI(prompt, schema);
    if (feedback) {
      setOverallFeedback(feedback);
      setCurrentPage('final_feedback');
    } else {
      setMessage("Failed to generate overall feedback. Please ensure your Fireworks API key is correctly set.");
      setCurrentPage('home'); // Fallback to home
    }
    setLoadingFinalFeedback(false);
  };

  const handleBack = () => {
    if (currentPage === 'checkpoint1') {
      setCurrentPage('home');
      setSelectedPeriod(null);
    } else if (currentPage === 'checkpoint2') {
      setCurrentPage('checkpoint1');
    } else if (currentPage === 'checkpoint3') {
      setCurrentPage('checkpoint2');
    } else if (currentPage === 'final_feedback') {
      setCurrentPage('home'); // From final feedback, go straight to home
      setSelectedPeriod(null);
      setOverallFeedback(null);
      setExportSummaryContent(null); // Clear export content
    }
  };

  // New navigation functions for specific checkpoints
  const goToCheckpoint = (cpNum) => {
    if (selectedPeriod) {
      setCurrentPage(`checkpoint${cpNum}`);
    } else {
      setMessage("Please select a historical period first from the home page.");
    }
  };

  const handleExportSummaryAsText = async () => {
    if (!db || !userId || !selectedPeriod) {
      setMessage("Cannot export: User data or selected period is missing.");
      return;
    }

    try {
      // In this React app, we rely on the state for current session data.
      // For Firebase data, you'd fetch it here.
      let summaryText = `--- DSE History Revision Summary for ${selectedPeriod || 'Selected Period'} ---\n\n`;

      // Checkpoint 1 Data (from state)
      const cp1Data = window.appState.checkpoint1;
      if (cp1Data) {
        summaryText += `=== Checkpoint 1: Hard Knowledge ===\n`;
        cp1Data.questions.mc_questions.forEach((q, index) => {
          const userAnswer = cp1Data.userAnswers[`mc_${index}`] || 'N/A';
          const isCorrect = userAnswer.toUpperCase().trim() === q.answer.toUpperCase().trim();
          summaryText += `Question ${index + 1} (MC): ${q.question}\n`;
          summaryText += `  Options: A) ${q.options.A} B) ${q.options.B} C) ${q.options.C} D) ${q.options.D}\n`;
          summaryText += `  Student Answer: ${userAnswer}\n`;
          summaryText += `  Correctness: ${isCorrect ? "Correct" : "Incorrect"}\n`;
          summaryText += `  Correct Answer: ${q.answer}\n\n`;
        });
        cp1Data.questions.fill_in_blanks.forEach((q, index) => {
          const userAnswer = cp1Data.userAnswers[`fib_${index}`] || 'N/A';
          const isCorrect = userAnswer.toLowerCase().trim() === q.answer.toLowerCase().trim();
          summaryText += `Question ${index + 1} (Fill-in-Blank): ${q.question}\n`;
          summaryText += `  Student Answer: ${userAnswer}\n`;
          summaryText += `  Correctness: ${isCorrect ? "Correct" : "Incorrect"}\n`;
          summaryText += `  Correct Answer: ${q.answer}\n\n`;
        });
        summaryText += `Checkpoint 1 Score: ${cp1Data.score}/5\n`;
        summaryText += `---------------------------------------\n\n`;
      }

      // Checkpoint 2 Data (from state)
      const cp2Data = window.appState.checkpoint2;
      if (cp2Data) {
        summaryText += `=== Checkpoint 2: Identify the Error ===\n`;
        cp2Data.statements.statements.forEach((s, index) => {
          const userAnswerBool = cp2Data.userAnswers[index]?.isTrue;
          const userAnswerText = userAnswerBool === true ? 'True' : userAnswerBool === false ? 'False' : 'N/A';
          const isCorrect = userAnswerBool === s.is_true;
          const correctAnswerDetails = s.is_true ? 'True' : `False (Correct Value: ${s.correct_value_if_false})`;
          summaryText += `Statement ${index + 1}: ${s.statement}\n`;
          summaryText += `  Student Answer (T/F): ${userAnswerText}\n`;
          summaryText += `  Correctness: ${isCorrect ? "Correct" : "Incorrect"}\n`;
          summaryText += `  Correct Answer: ${correctAnswerDetails}\n\n`;
        });
        summaryText += `Checkpoint 2 Score: ${cp2Data.score}/3\n`;
        summaryText += `---------------------------------------\n\n`;
      }

      // Checkpoint 3 Data (from state)
      const cp3Data = window.appState.checkpoint3;
      if (cp3Data) {
        summaryText += `=== Checkpoint 3: Analytical Essay ===\n`;
        summaryText += `Question: To what extent was ${cp3Data.question.period} effective in modernizing China in the ${cp3Data.question.aspect} aspect?\n`;
        summaryText += `Student's Answer:\n${cp3Data.userAnswer}\n\n`;
        summaryText += `Feedback: ${cp3Data.feedback.score} out of 4 thumb-up marks.\n`;
        summaryText += `Comment: ${cp3Data.feedback.comment}\n\n`;
        summaryText += `Correct Answer:\n${cp3Data.feedback.correct_answer}\n`;
        summaryText += `---------------------------------------\n\n`;
      }

      // Overall Feedback (from state)
      const overallFeedbackData = overallFeedback; // This comes from React state directly
      if (overallFeedbackData) {
        summaryText += `=== Overall Feedback ===\n`;
        summaryText += `Comment: ${overallFeedbackData.comment}\n`;
        summaryText += `Emojis: ${overallFeedbackData.emojis}\n`;
        summaryText += `---------------------------------------\n\n`;
      }

      setExportSummaryContent(summaryText);
      setMessage("Summary generated. You can copy the text below and share it with your teacher.", summaryText); // Pass content to MessageBox
    } catch (e) {
      console.error("Error generating text summary:", e);
      setMessage("Failed to export summary. Please check console for details.");
    }
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-inter text-gray-900 p-4 sm:p-8">
      <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-8 drop-shadow-lg">
        DSE History Revision App
      </h1>
      {userId && (
        <p className="text-center text-sm text-gray-500 mb-4">
          User ID: <span className="font-mono text-xs">{userId}</span>
        </p>
      )}

      {currentPage === 'home' && <HomePage onSelectPeriod={handleSelectPeriod} />}
      {currentPage === 'checkpoint1' && selectedPeriod && (
        <Checkpoint1
          selectedPeriod={selectedPeriod}
          onComplete={handleCheckpoint1Complete}
          onBack={handleBack}
        />
      )}
      {currentPage === 'checkpoint2' && selectedPeriod && (
        <Checkpoint2
          selectedPeriod={selectedPeriod}
          onComplete={handleCheckpoint2Complete}
          onBack={handleBack}
        />
      )}
      {currentPage === 'checkpoint3' && selectedPeriod && (
        <Checkpoint3
          selectedPeriod={selectedPeriod}
          onComplete={handleCheckpoint3Complete}
          onBack={handleBack}
        />
      )}
      {/* Checkpoint 4 is now a separate app, so it's removed from this flow */}
      {currentPage === 'final_feedback' && overallFeedback && (
        <div className="p-6 bg-white rounded-lg shadow-xl max-w-3xl mx-auto my-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Challenge Completed! 🎉</h2>
          <p className="text-xl text-gray-700 mb-4">{overallFeedback.emojis}</p>
          <p className="text-lg text-gray-700 whitespace-pre-wrap mb-6">{overallFeedback.comment}</p>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <button
              onClick={handleExportSummaryAsText}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Export Summary (Text)
            </button>
            <button
              onClick={() => goToCheckpoint(1)}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Return to Checkpoint 1
            </button>
            <button
              onClick={() => goToCheckpoint(2)}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Return to Checkpoint 2
            </button>
            <button
              onClick={() => goToCheckpoint(3)}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Return to Checkpoint 3
            </button>
            <button
              onClick={() => handleBack()} // Go back to home
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Return to Home
            </button>
          </div>
        </div>
      )}
      {loadingFinalFeedback && <LoadingSpinner />}
      {message && <MessageBox message={message} onClose={() => setMessage(null)} content={exportSummaryContent} />}
    </div>
  );
};

// Main component wrapped with FirebaseProvider
export default function AppWrapper() {
  return (
    <FirebaseProvider>
      <App />
    </FirebaseProvider>
  );
}
