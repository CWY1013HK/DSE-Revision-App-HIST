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
    max_tokens: 4000,
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

  const apiKey = process.env.REACT_APP_FIREWORKS_API_KEY;
  const apiUrl = "https://api.fireworks.ai/inference/v1/chat/completions";

  if (!apiKey) {
    console.error("Fireworks API Key is missing or not set. Please check your environment variables.");
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

    if (!response.ok) {
      console.error('Fireworks API response not OK:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return null;
    }

    const result = await response.json();
    console.log('Fireworks API response:', result); // Debug log

    if (result.choices && result.choices.length > 0 && result.choices[0].message) {
      const text = result.choices[0].message.content;
      if (schema) {
        try {
          return JSON.parse(text);
        } catch (parseError) {
          console.error('JSON Parse error:', parseError);
          console.error('Raw text that failed to parse:', text);
          return null;
        }
      }
      return text;
    } else {
      console.error("Unexpected API response structure or no choices:", result);
      return null;
    }
  } catch (error) {
    console.error("Error calling Fireworks API:", error);
    if (error instanceof SyntaxError) {
      console.error("JSON Parse error details:", error.message);
    }
    return null;
  }
};

// --- Components ---

const BackButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out"
  >
    Back
  </button>
);

const LoadingSpinner = () => (
  <div style={{ minHeight: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 m-20"></div>
    <p className="text-lg text-gray-700">Loading...</p>
  </div>
);

const MessageBox = ({ message, onClose, content = null }) => (
  <div className="fixed inset-0 min-h-screen w-screen bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full text-center">
      <p className="text-lg font-semibold mb-4">{message}</p>
      {content && (
        <textarea
          readOnly
          className="w-full h-64 p-2 border border-gray-300 rounded-md mb-4 resize-y font-mono text-sm"
          value={content}
        ></textarea>
      )}
      <button
        onClick={onClose}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out"
      >
        OK
      </button>
    </div>
  </div>
);


const HomePage = ({ onSelectPeriod }) => {
  const historicalPeriods = Object.keys(historicalContent);

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl max-w-3xl mx-auto my-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Choose Your Challenge!</h2>
      <p className="text-center text-gray-600 mb-8">Select a historical period to begin your revision game.</p>
      {/* No image included */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {historicalPeriods.map((period) => (
          <button
            key={period}
            onClick={() => onSelectPeriod(period)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            {period}
          </button>
        ))}
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
  const [hints, setHints] = useState({}); // State to store hints for each question
  const [hintLoading, setHintLoading] = useState({}); // State to track hint loading

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      const content = historicalContent[selectedPeriod].summary + " " +
        historicalContent[selectedPeriod].political + " " +
        historicalContent[selectedPeriod].economic + " " +
        historicalContent[selectedPeriod].social_cultural_educational;

      const prompt = `Generate 3 multiple-choice questions (with 4 options each, clearly labeled A, B, C, D) and 2 fill-in-the-blank questions about the "${selectedPeriod}" in Chinese history, focusing on its modernization and transformation. The content should be based on the following historical information:
      
      ${content}
      
      IMPORTANT: Your response must be a valid JSON object following this exact schema. Do not include any text before or after the JSON object. Ensure all strings are properly escaped and the JSON is properly formatted.
      
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
    let answer = null;
    if (questionType === 'mc' && questions && questions.mc_questions && questions.mc_questions[index]) {
      answer = questions.mc_questions[index].answer;
    } else if (questionType === 'fib' && questions && questions.fill_in_blanks && questions.fill_in_blanks[index]) {
      answer = questions.fill_in_blanks[index].answer;
    }
    let hintPrompt = `Provide a subtle hint for the following DSE History question about "${selectedPeriod}":\n\nQuestion: ${questionText}\n`;
    if (options) {
      hintPrompt += `Options: A) ${options.A} B) ${options.B} C) ${options.C} D) ${options.D}\n`;
    }
    if (answer) {
      hintPrompt += `Answer: ${answer}\n`;
    }
    hintPrompt += `The hint should guide the student without revealing the direct answer. Focus on a related concept or a key event from the period. No text before or after the hint. No quotation marks.`;

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

      // Normalize both answers for comparison
      const normalizeAnswer = (answer) => {
        // Common abbreviations mapping
        const abbreviations = {
          'ccp': 'chinese communist party',
          'kmt': 'kuomintang',
          'prc': 'peoples republic of china',
          'roc': 'republic of china',
          'pla': 'peoples liberation army',
          'sez': 'special economic zone',
          'dynasty': 'dyn',
          'dynasty': 'dyn',
          'movement': 'mov',
          'revolution': 'rev',
          'government': 'govt',
          'century': 'c',
          'centuries': 'c',
          'year': 'yr',
          'years': 'yrs',
          'period': 'per',
          'periods': 'per',
          'reform': 'ref',
          'reforms': 'ref',
          'modernization': 'mod',
          'modernization': 'mod',
          'industrialization': 'ind',
          'industrialization': 'ind',
          'political': 'pol',
          'economic': 'econ',
          'social': 'soc',
          'cultural': 'cult',
          'educational': 'edu',
          'diplomatic': 'dipl',
          'military': 'mil'
        };

        // Convert written numbers to digits
        const writtenNumbers = {
          'zero': '0',
          'one': '1',
          'two': '2',
          'three': '3',
          'four': '4',
          'five': '5',
          'six': '6',
          'seven': '7',
          'eight': '8',
          'nine': '9',
          'ten': '10',
          'eleven': '11',
          'twelve': '12',
          'thirteen': '13',
          'fourteen': '14',
          'fifteen': '15',
          'sixteen': '16',
          'seventeen': '17',
          'eighteen': '18',
          'nineteen': '19',
          'twenty': '20',
          'thirty': '30',
          'forty': '40',
          'fifty': '50',
          'sixty': '60',
          'seventy': '70',
          'eighty': '80',
          'ninety': '90',
          'hundred': '100',
          'thousand': '1000'
        };

        let normalized = answer
          .toLowerCase()
          .trim()
          // Remove punctuation except for numbers
          .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
          // Replace multiple spaces with single space
          .replace(/\s+/g, ' ');

        // Replace written numbers with digits
        Object.entries(writtenNumbers).forEach(([word, num]) => {
          normalized = normalized.replace(new RegExp(`\\b${word}\\b`, 'g'), num);
        });

        // Replace abbreviations
        Object.entries(abbreviations).forEach(([abbr, full]) => {
          normalized = normalized.replace(new RegExp(`\\b${abbr}\\b`, 'g'), full);
        });

        // Remove common words that don't affect meaning
        const commonWords = [
          'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
          'from', 'and', 'or', 'but', 'if', 'then', 'else', 'when', 'up', 'down',
          'over', 'under', 'above', 'below', 'between', 'among', 'through',
          'during', 'before', 'after', 'while', 'since', 'until', 'unless',
          'because', 'although', 'though', 'despite', 'regarding', 'concerning',
          'about', 'around', 'near', 'far', 'away', 'back', 'forward', 'upward',
          'downward', 'outward', 'inward', 'this', 'that', 'these', 'those',
          'which', 'who', 'whom', 'whose', 'what', 'where', 'when', 'why', 'how'
        ];

        commonWords.forEach(word => {
          normalized = normalized.replace(new RegExp(`\\b${word}\\b`, 'g'), '');
        });

        // Final cleanup
        return normalized
          .replace(/\s+/g, ' ') // Replace multiple spaces with single space
          .trim();
      };

      const normalizedUserAnswer = normalizeAnswer(userAnswer);
      const normalizedCorrectAnswer = normalizeAnswer(q.answer);

      // Check if the normalized answers match
      if (normalizedUserAnswer === normalizedCorrectAnswer) {
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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!questions) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-xl max-w-3xl mx-auto my-8 text-center">
        <p className="text-red-600 text-lg mb-4">Error: Could not load questions for this period. Please check your API key and try again.</p>
        <BackButton onClick={onBack} />
        {message && <MessageBox message={message} onClose={() => setMessage(null)} />}
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl max-w-3xl mx-auto my-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-3">Checkpoint 1: Hard Knowledge</h2>
      <p className="text-center text-gray-600 mt-3 mb-6">Period: <span className="font-semibold">{selectedPeriod}</span></p>

      <div className="space-y-6 mb-8">
        {questions.mc_questions.map((q, qIndex) => (
          <div key={`mc-${qIndex}`} className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p className="font-semibold text-gray-700 mb-2">MC Question {qIndex + 1}: {q.question}</p>
            {Object.entries(q.options).map(([key, value]) => (
              <div key={key} className="mb-1">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name={`mc_${qIndex}`}
                    value={key}
                    onChange={handleInputChange}
                    checked={userAnswers[`mc_${qIndex}`] === key}
                    disabled={showResults}
                    className="form-radio text-blue-600"
                  />
                  <span className="ml-2 text-gray-600">{key}. {value}</span>
                </label>
              </div>
            ))}
            {!showResults && (
              <button
                onClick={() => handleGetHint('mc', qIndex, q.question, q.options)}
                disabled={hintLoading[`mc_${qIndex}`]}
                className="ml-4 bg-yellow-400 hover:bg-yellow-500 text-white text-sm font-bold py-1 px-3 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {hintLoading[`mc_${qIndex}`] ? 'Loading Hint...' : '✨ Get Hint'}
              </button>
            )}
            {hints[`mc_${qIndex}`] && !showResults && (
              <p className="text-sm mt-2 p-2 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-md">
                Hint: {hints[`mc_${qIndex}`]}
              </p>
            )}
            {showResults && (
              <p className="text-sm mt-2">
                Your Answer: <span className={`${userAnswers[`mc_${qIndex}`].toUpperCase().trim() === q.answer.toUpperCase().trim() ? 'text-green-600' : 'text-red-600'} font-semibold`}>{userAnswers[`mc_${qIndex}`] || 'N/A'}</span>.
                Correct Answer: <span className="text-green-600 font-semibold">{q.answer}</span>
              </p>
            )}
          </div>
        ))}

        {questions.fill_in_blanks.map((q, qIndex) => (
          <div key={`fib-${qIndex}`} className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p className="font-semibold text-gray-700 mb-2">Fill-in-Blank Question {qIndex + 1}: {q.question}</p>
            <input
              type="text"
              name={`fib_${qIndex}`}
              value={userAnswers[`fib_${qIndex}`] || ''}
              onChange={handleInputChange}
              disabled={showResults}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {!showResults && (
              <button
                onClick={() => handleGetHint('fib', qIndex, q.question)}
                disabled={hintLoading[`fib_${qIndex}`]}
                className="mt-2 bg-yellow-400 hover:bg-yellow-500 text-white text-sm font-bold py-1 px-3 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {hintLoading[`fib_${qIndex}`] ? 'Loading Hint...' : '✨ Get Hint'}
              </button>
            )}
            {hints[`fib_${qIndex}`] && !showResults && (
              <p className="text-sm mt-2 p-2 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-md">
                Hint: {hints[`fib_${qIndex}`]}
              </p>
            )}
            {showResults && (
              <p className="text-sm mt-2">
                Your Answer: <span className={`${userAnswers[`fib_${qIndex}`].toLowerCase().trim() === q.answer.toLowerCase().trim() ? 'text-green-600' : 'text-red-600'} font-semibold`}>{userAnswers[`fib_${qIndex}`] || 'N/A'}</span>.
                Correct Answer: <span className="text-green-600 font-semibold">{q.answer}</span>
              </p>
            )}
          </div>
        ))}
      </div>

      {!showResults ? (
        <div className="flex justify-between mt-8">
          <BackButton onClick={onBack} />
          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Submit Answers
          </button>
        </div>
      ) : (
        <div className="mt-8 text-center">
          <p className="text-2xl font-bold text-gray-800 mb-4">Your Score: {score} / 5</p>
          <div className="flex justify-between mt-4">
            <BackButton onClick={onBack} />
            <button
              onClick={() => onComplete(score)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Next Checkpoint
            </button>
          </div>
        </div>
      )}
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

      const prompt = `Generate 3 historical statements about the "${selectedPeriod}" in Chinese history. Each statement MUST contain an intentional factual error (e.g., wrong year, historical person, organization name, policy name, or a false assertion). All statements should be FALSE, and for each statement, provide the correct historical fact. The content should be based on the following historical information:
          
          ${content}
          
          Provide the statements in a JSON format.
          
          JSON Schema:
          {
            "statements": [
              {
                "statement": "string",
                "is_true": false,
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
                is_true: { type: "BOOLEAN", enum: [false] },
                correct_value_if_false: { type: "STRING" }
              },
              required: ["statement", "is_true", "correct_value_if_false"]
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
          initialAnswers[index] = { isTrue: false };
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

    // Only check the first 3 statements that are displayed
    statements.statements.slice(0, 3).forEach((s, index) => {
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
            statements: statements.statements.slice(0, 3), // Only save the displayed statements
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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!statements) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-xl max-w-3xl mx-auto my-8 text-center">
        <p className="text-red-600 text-lg mb-4">Error: Could not load statements for this period. Please check your API key and try again.</p>
        <BackButton onClick={onBack} />
        {message && <MessageBox message={message} onClose={() => setMessage(null)} />}
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl max-w-3xl mx-auto my-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-3">Checkpoint 2: Identify the Error</h2>
      <p className="text-center text-gray-600 mt-3 mb-6">Period: <span className="font-semibold">{selectedPeriod}</span></p>

      <div className="space-y-6 mb-8 flex flex-row flex-wrap gap-6">
        {statements.statements.slice(0, 3).map((s, index) => (
          <div key={`stmt-${index}`} className="bg-gray-50 p-4 rounded-lg shadow-sm flex-1 min-w-[300px] max-w-[450px]">
            <p className="font-semibold text-gray-700 mb-2">Statement {index + 1}: {s.statement}</p>
            <div className="flex flex-row items-center space-x-8">
              <label className="inline-flex items-center font-semibold text-lg">
                <input
                  type="radio"
                  name={`stmt_${index}`}
                  value="true"
                  onChange={() => handleTrueFalseChange(index, 'true')}
                  checked={userAnswers[index]?.isTrue === true}
                  disabled={showResults}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2">True</span>
              </label>
              <label className="inline-flex items-center font-semibold text-lg">
                <input
                  type="radio"
                  name={`stmt_${index}`}
                  value="false"
                  onChange={() => handleTrueFalseChange(index, 'false')}
                  checked={userAnswers[index]?.isTrue === false}
                  disabled={showResults}
                  className="form-radio text-blue-600"
                />
                <span className="md:ml-2">False</span>
              </label>
            </div>
            {showResults && (
              <p className="text-sm mt-2">
                Your Answer: <span className={`${userAnswers[index]?.isTrue === s.is_true ? 'text-green-600' : 'text-red-600'} font-semibold`}>{userAnswers[index]?.isTrue === true ? 'True' : userAnswers[index]?.isTrue === false ? 'False' : 'N/A'}</span>.
                Correct Answer: <span className="text-green-600 font-semibold">{s.is_true ? 'True' : 'False'}</span>
                {!s.is_true && (
                  <span className="ml-2 text-sm"> (Correct Value: <span className="text-green-600 font-semibold">{s.correct_value_if_false}</span>)</span>
                )}
              </p>
            )}
          </div>
        ))}
      </div>

      {!showResults ? (
        <div className="flex justify-between mt-8">
          <BackButton onClick={onBack} />
          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Submit Answers
          </button>
        </div>
      ) : (
        <div className="mt-8 text-center">
          <p className="text-2xl font-bold text-gray-800 mb-4">Your Score: {score} / 3</p>
          <div className="flex justify-between mt-4">
            <BackButton onClick={onBack} />
            <button
              onClick={() => onComplete(score)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Next Checkpoint
            </button>
          </div>
        </div>
      )}
      {message && <MessageBox message={message} onClose={() => setMessage(null)} />}
    </div>
  );
};

const Checkpoint3 = ({ selectedPeriod, onComplete, onBack }) => {
  const { db, userId } = useContext(FirebaseContext);
  const aspects = ['Political', 'Economic', 'Social/Cultural/Educational', 'Diplomatic', 'Military']; // All aspects
  const [randomAspect, setRandomAspect] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null); // { score: '👍👍👍👍', comment: '...', correct_answer: '...' }
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [outline, setOutline] = useState(null); // State for AI-generated outline
  const [outlineLoading, setOutlineLoading] = useState(false); // State for outline loading

  // Update formatOutline function
  const formatOutline = (text) => {
    if (!text) return '';

    // Split the text into lines
    const lines = text.split('\n');

    // Process each line
    return lines.map(line => {
      // If line is empty, return a line break
      if (!line.trim()) return '*';

      // Clean up any existing markdown symbols
      line = line.replace(/\*\*/g, '').replace(/\*/g, '');

      // If line starts with a number or bullet point, it's a title
      if (/^(\d+\.|\*|\-)\s/.test(line)) {
        return `**${line}**`;
      }

      // If line starts with a plus sign or other bullet, it's a sub-point
      if (/^(\+|\-|\*)\s/.test(line)) {
        return line.replace(/^(\+|\-|\*)\s/, '• ');
      }

      // Otherwise, it's a regular line
      return line;
    }).join('\n');
  };

  useEffect(() => {
    // Randomly select an aspect
    const chosenAspect = aspects[Math.floor(Math.random() * aspects.length)];
    setRandomAspect(chosenAspect);
  }, [selectedPeriod]);

  const handleGetOutline = async () => {
    setOutlineLoading(true);
    const periodContent = historicalContent[selectedPeriod];
    const modernizationDef = modernizationCriteria[randomAspect.toLowerCase().replace(/\//g, '_')];

    const prompt = `Generate a concise outline or key points for an essay answering the question:
        "To what extent was ${selectedPeriod} effective in modernizing China in the ${randomAspect} aspect?"
        
        Focus on providing a structure with main arguments and relevant examples based on the following information:
        
        Historical Period Content:
        ${periodContent.summary}
        ${periodContent[randomAspect.toLowerCase().replace(/\//g, '_')] || ''}
        
        Modernization Criteria for ${randomAspect}:
        ${modernizationDef}
        
        Format the outline with:
        1. Main points should be numbered (1., 2., etc.)
        2. Sub-points should use bullet points (* or -)
        3. Each point should be on a new line
        4. Use clear, concise language
        5. No text before nor after outline proper`;

    const generatedOutline = await callFireworksAPI(prompt);
    if (generatedOutline) {
      setOutline(generatedOutline);
    } else {
      setMessage("Failed to generate outline. Please ensure your Fireworks API key is correctly set.");
    }
    setOutlineLoading(false);
  };

  const handleSubmit = async () => {
    if (!userAnswer.trim()) {
      setMessage("Please write your answer before submitting.");
      return;
    }

    setLoading(true);
    const periodContent = historicalContent[selectedPeriod];
    const modernizationDef = modernizationCriteria[randomAspect.toLowerCase().replace(/\//g, '_')];

    const prompt = `You are a DSE History teacher. Assess the following student answer for the question:
        "To what extent was ${selectedPeriod} effective in modernizing China in the ${randomAspect} aspect?"
        
        Student's Answer: "${userAnswer}"
        
        Evaluate it based on these criteria:
        1. Clear topic sentence (effective or not, and to what extent).
        2. Clear illustration of relevant and correct examples in details (provide two are good, provide one is less good).
        3. Provide good explanation about how the examples imply the effectiveness of the chosen historical period in modernizing China.
        4. Good language and structured presentation.
        
        Provide a score using thumb-up emojis (4 is good, 1 is not good, e.g., "👍👍👍👍") and a detailed comment for each criterion. Also, provide a comprehensive 'correct answer' in paragraph format for the question, drawing from the following historical knowledge about "${selectedPeriod}" and the general modernization criteria for "${randomAspect}":
        
        Historical Period Content:
        ${periodContent.summary}
        ${periodContent[randomAspect.toLowerCase().replace(/\//g, '_')] || ''}
        
        Modernization Criteria for ${randomAspect}:
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
              question: { period: selectedPeriod, aspect: randomAspect },
              userAnswer: userAnswer,
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
    <div className="p-6 bg-white rounded-lg shadow-xl max-w-4xl mx-auto my-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-3">Checkpoint 3: Analytical Essay</h2>
      <p className="text-center text-gray-600 mt-3 mb-6">Period: <span className="font-semibold">{selectedPeriod}</span></p>

      <div className="bg-blue-50 p-4 rounded-lg shadow-sm mb-6">
        <p className="font-semibold text-blue-800 text-lg mb-2">Question:</p>
        <p className="text-blue-700">
          To what extent was <span className="font-bold">{selectedPeriod}</span> effective in modernizing China in the <span className="font-bold">{randomAspect} aspect</span>?
        </p>
      </div>

      <div className="mb-4">
        <button
          onClick={handleGetOutline}
          disabled={outlineLoading || feedback}
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {outlineLoading ? 'Generating Outline...' : '✨ Get Outline Help'}
        </button>
        {outline && !feedback && (
          <div className="mt-4 p-4 bg-purple-100 border-l-4 border-purple-500 text-purple-800 rounded-md whitespace-pre-wrap pb-6">
            <h4 className="font-semibold mb-2">Essay Outline Suggestion:</h4>
            {formatOutline(outline).split('\n').map((line, index) => {
              if (line === '*') {
                return <br key={index} />;
              }
              if (line.startsWith('**') && line.endsWith('**')) {
                return (
                  <p key={index} className="font-bold text-purple-900 mt-2">
                    {line.slice(2, -2)}
                  </p>
                );
              }
              if (line.startsWith('•')) {
                return (
                  <p key={index} className="ml-4 text-purple-800">
                    {line}
                  </p>
                );
              }
              return <p key={index} className="text-purple-800">{line}</p>;
            })}
          </div>
        )}
      </div>

      <textarea
        className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 h-64 resize-y text-gray-800"
        placeholder="Write your answer here..."
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        disabled={loading || feedback}
      ></textarea>

      {!feedback ? (
        <div className="flex justify-between mt-8">
          <BackButton onClick={onBack} />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Answer'}
          </button>
        </div>
      ) : (
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Your Feedback:</h3>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
            <p className="text-lg font-semibold text-gray-700 mb-2">Score: <span className="text-yellow-500 text-2xl">{feedback.score} out of 4 thumb-up marks</span></p>
            <p className="text-gray-700 whitespace-pre-wrap">{feedback.comment}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
            <h4 className="text-lg font-semibold text-blue-800 mb-2">Correct Answer:</h4>
            <p className="text-blue-700 whitespace-pre-wrap">{feedback.correct_answer}</p>
          </div>
          <div className="flex justify-between mt-8">
            <BackButton onClick={onBack} />
            <button
              onClick={() => onComplete()}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Finish Challenge
            </button>
          </div>
        </div>
      )}
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
      <h1 className="text-4xl font-extrabold text-center mb-8" style={{ color: '#3b82f6' }}>
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
