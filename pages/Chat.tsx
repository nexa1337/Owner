
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TbUser, TbRefresh } from 'react-icons/tb';
import Icon from '../components/Icon';

// --- TYPES ---
type Language = 'EN' | 'FR' | 'AR';

interface Question {
  id: string;
  text: Record<Language, string>;
  answer: Record<Language, string>;
}

interface Section {
  id: string;
  title: Record<Language, string>;
  questions: Question[];
}

interface Message {
  id: string;
  role: 'bot' | 'user';
  content: string;
  timestamp: Date;
}

// --- DATA ---
const STATIC_DATA: Section[] = [
  {
    id: 'section1',
    title: {
      EN: 'About Marouan',
      FR: 'À propos',
      AR: 'عن مروان'
    },
    questions: [
      {
        id: 'q1_1',
        text: {
          EN: 'Who is Marouan Anouar?',
          FR: 'Qui est Marouan Anouar ?',
          AR: 'من هو مروان أنور؟'
        },
        answer: {
          EN: 'Marouan Anouar, born on October 19, 1997, is Moroccan, 175 cm tall, attractive, daring, and always ready to take calculated risks.',
          FR: 'Marouan Anouar, né le 19 octobre 1997, est marocain, mesure 175 cm, séduisant, audacieux et toujours prêt à prendre des risques calculés.',
          AR: 'مروان أنور، من مواليد 19 أكتوبر 1997، مغربي، طوله 175 سم، جذاب وجريء، ودائم الاستعداد لتحمل المخاطر المحسوبة.'
        }
      },
      {
        id: 'q1_2',
        text: {
          EN: 'What is his personality?',
          FR: 'Quelle est sa personnalité ?',
          AR: 'ما هي شخصيته؟'
        },
        answer: {
          EN: 'Determined, independent, does what he feels is right. Humble, open-minded, logical. Not social by default, sometimes prefers to stay alone. Sigma personality.',
          FR: 'Déterminé, indépendant, fait ce qu’il pense être juste. Humble, ouvert d’esprit et logique. Pas très social, préfère parfois rester seul. Personnalité Sigma.',
          AR: 'مصمم ومستقل، يفعل ما يراه صائبًا. متواضع، منفتح العقل، وعقلاني. أحيانًا يفضل العزلة. شخصية Sigma.'
        }
      },
      {
        id: 'q1_3',
        text: {
          EN: 'What are his passions and hobbies?',
          FR: 'Quelles sont ses passions et hobbies ?',
          AR: 'ما هي اهتماماته وهواياته؟'
        },
        answer: {
          EN: 'Sport bikes: Honda CBR 600 RR, Suzuki GSXR 750, S1000RR, Kawasaki Ninja ZX6R; Supercars: Nissan GT-R, Supra, Lamborghinis (Aventador, Huracan), Audi R8; Gaming: Open-world, Racing, FPS; Fitness / Bodybuilding; Tokyo mindset / Japanese car culture.',
          FR: 'Motos sportives : Honda CBR 600 RR, Suzuki GSXR 750, S1000RR, Kawasaki Ninja ZX6R; Supercars : Nissan GT-R, Supra, Lamborghini (Aventador, Huracan), Audi R8; Jeux vidéo : Open-world, Course, FPS; Fitness / musculation; Mentalité Tokyo / culture automobile japonaise.',
          AR: 'الدراجات النارية الرياضية: Honda CBR 600 RR، Suzuki GSXR 750، S1000RR، Kawasaki Ninja ZX6R؛ السيارات الخارقة: Nissan GT-R، Supra، Lamborghini (Aventador، Huracan)، Audi R8؛ الألعاب: عالم مفتوح، سباقات، FPS؛ اللياقة البدنية / كمال الأجسام؛ ثقافة طوكيو.'
        }
      },
      {
        id: 'q1_4',
        text: {
          EN: 'What makes him unique?',
          FR: 'Qu’est-ce qui le rend unique ?',
          AR: 'ما الذي يجعله مميزاً؟'
        },
        answer: {
          EN: 'Natural leadership, flexible, loves learning new things, adapts quickly.',
          FR: 'Leadership naturel, flexible, adore apprendre de nouvelles choses, s’adapte rapidement.',
          AR: 'يمتلك شخصية قيادية بالفطرة، مرن، يحب تعلم أشياء جديدة، ويتأقلم بسرعة مع أي بيئة.'
        }
      },
      {
        id: 'q1_5',
        text: {
          EN: 'What is his life philosophy?',
          FR: 'Quelle est sa philosophie de vie ?',
          AR: 'ما هي فلسفته في الحياة؟'
        },
        answer: {
          EN: 'Never waste an opportunity, live life fully in both length and depth, respecting divine order.',
          FR: 'Ne jamais laisser passer une opportunité, vivre pleinement la vie dans sa longueur et sa profondeur, tout en respectant l’ordre divin.',
          AR: 'لا تضيع أي فرصة، عش الحياة بكاملها بعمق وطول، مع احترام النظام الإلهي.'
        }
      },
      {
        id: 'q1_6',
        text: {
          EN: 'What is his biggest dream?',
          FR: 'Quel est son plus grand rêve ?',
          AR: 'ما هو حلمه الأكبر؟'
        },
        answer: {
          EN: 'Achieve financial freedom. Not sure how or when, but he strongly feels it is within reach.',
          FR: 'Atteindre la liberté financière. Il ne sait pas exactement comment ni quand, mais il sent fortement que c’est possible.',
          AR: 'تحقيق الحرية المالية. لا يعرف متى أو كيف، لكنه يشعر بقوة أنه ممكن الوصول إليه.'
        }
      }
    ]
  },
  {
    id: 'section2',
    title: {
      EN: 'NEXA 1337',
      FR: 'NEXA 1337',
      AR: 'NEXA 1337'
    },
    questions: [
      {
        id: 'q2_1',
        text: {
          EN: 'What does NEXA 1337 mean?',
          FR: 'Que signifie NEXA 1337 ?',
          AR: 'ماذا تعني NEXA 1337؟'
        },
        answer: {
          EN: 'NEXA 1337 is an acronym: N = Next Generation, E = Elite Mindset, X = X-Factor, A = Advanced Technology; 1,3,3,7 = "LEET", the global code for mastery, pro level, and digital excellence; 1337 is widely used in tech and gaming culture.',
          FR: 'NEXA 1337 est un acronyme : N = Next Generation, E = Elite Mindset, X = X-Factor, A = Advanced Technology ; 1,3,3,7 = "LEET", le code mondial pour la maîtrise, niveau pro et excellence digitale ; 1337 est largement utilisé dans la culture tech et gaming.',
          AR: 'NEXA 1337 هو اختصار: N = الجيل القادم، E = العقلية النخبوية، X = العامل المميز، A = التكنولوجيا المتقدمة؛ 1,3,3,7 = "LEET"، الرمز العالمي للإتقان والمستوى الاحترافي والتميز الرقمي؛ 1337 رقم شائع في ثقافة التقنية والألعاب.'
        }
      },
      {
        id: 'q2_2',
        text: {
          EN: 'Why was NEXA 1337 created?',
          FR: 'Pourquoi NEXA 1337 a-t-elle été créée ?',
          AR: 'لماذا تم إنشاء NEXA 1337؟'
        },
        answer: {
          EN: 'To help small businesses move from offline to online and reach more clients.',
          FR: 'Pour aider les petites entreprises à passer du offline au online et atteindre plus de clients.',
          AR: 'لمساعدة المشاريع الصغيرة على الانتقال من العالم التقليدي إلى الرقمي والوصول إلى عدد أكبر من العملاء.'
        }
      },
      {
        id: 'q2_3',
        text: {
          EN: 'What is its main goal?',
          FR: 'Quel est son objectif principal ?',
          AR: 'ما هو هدفها الرئيسي؟'
        },
        answer: {
          EN: 'Start small, grow, and become a leading agency in the digital field.',
          FR: 'Commencer petit, grandir et devenir une agence leader dans le digital.',
          AR: 'البدء صغيرًا، النمو، والتحول إلى وكالة رائدة في المجال الرقمي.'
        }
      },
      {
        id: 'q2_4',
        text: {
          EN: 'Who is it for?',
          FR: 'Pour qui est-ce ?',
          AR: 'لمن هي موجهة؟'
        },
        answer: {
          EN: 'Anyone seeking financial freedom.',
          FR: 'Pour toute personne cherchant la liberté financière.',
          AR: 'لكل من يبحث عن الحرية المالية.'
        }
      },
      {
        id: 'q2_5',
        text: {
          EN: 'Where does it operate?',
          FR: 'Où opère-t-elle ?',
          AR: 'أين تعمل؟'
        },
        answer: {
          EN: 'Worldwide.',
          FR: 'À l’international.',
          AR: 'عالمياً.'
        }
      }
    ]
  },
  {
    id: 'section3',
    title: {
      EN: 'Architecture & 3D',
      FR: 'Architecture & 3D',
      AR: 'المعمار & 3D'
    },
    questions: [
      {
        id: 'q3_1',
        text: {
          EN: 'What does Architecture & 3D mean to Marouan?',
          FR: 'Que signifient l’architecture et la 3D pour Marouan ?',
          AR: 'ماذا تعني الهندسة المعمارية لمروان؟'
        },
        answer: {
          EN: 'Architecture & 3D is the path that allows me to achieve my goals and the field I live from. It is both my passion and profession.',
          FR: 'L’architecture et la 3D sont le chemin qui me permet d’atteindre mes objectifs et le domaine dont je vis. C’est à la fois ma passion et ma profession.',
          AR: 'الهندسة المعمارية والتصميم ثلاثي الأبعاد هي الطريق الذي يمكنني من تحقيق أهدافي والمجال الذي أعيش منه. هو شغفي وعملي في نفس الوقت.'
        }
      },
      {
        id: 'q3_2',
        text: {
          EN: 'Where does he work?',
          FR: 'Où travaille-t-il ?',
          AR: 'أين يعمل؟'
        },
        answer: {
          EN: 'I currently work in a company specialized in kitchen renovation and interior arrangement.',
          FR: 'Je travaille actuellement dans une société spécialisée dans la rénovation de cuisines et l’aménagement intérieur.',
          AR: 'أعمل حالياً في شركة متخصصة في تجديد المطابخ والتصميم الداخلي.'
        }
      },
      {
        id: 'q3_3',
        text: {
          EN: 'What is his role?',
          FR: 'Quel est son rôle ?',
          AR: 'ما هو دوره؟'
        },
        answer: {
          EN: 'Responsible for the showroom: meet clients, create 3D concepts, prepare quotations, issue invoices; chantier team executes projects.',
          FR: 'Responsable du showroom : rencontre clients, crée concepts 3D, prépare devis, émet factures ; l’équipe chantier exécute les projets.',
          AR: 'مسؤول عن صالة العرض: ألتقي بالعملاء، أصمم المفاهيم ثلاثية الأبعاد، أعد العروض السعرية وأصدر الفواتير. تنفيذ المشاريع يتولاه فريق الورش.'
        }
      },
      {
        id: 'q3_4',
        text: {
          EN: 'Tools he uses:',
          FR: 'Outils qu’il utilise :',
          AR: 'الأدوات التي يستخدمها:'
        },
        answer: {
          EN: '2D: AutoCAD, ArchiCAD, Revit; 3D: SketchUp, 3ds Max; Rendering: V-Ray, Lumion, D5, Twinmotion',
          FR: '2D: AutoCAD, ArchiCAD, Revit; 3D: SketchUp, 3ds Max; Rendu: V-Ray, Lumion, D5, Twinmotion',
          AR: '2D: AutoCAD، ArchiCAD، Revit; 3D: SketchUp، 3ds Max; الرندر: V-Ray، Lumion، D5، Twinmotion'
        }
      },
      {
        id: 'q3_5',
        text: {
          EN: 'Skills he has:',
          FR: 'Compétences qu’il possède :',
          AR: 'المهارات التي يمتلكها:'
        },
        answer: {
          EN: '2D architectural planning, interior design, structural design, and many more.',
          FR: 'Planification 2D en architecture, design intérieur, conception structurelle, et beaucoup d’autres.',
          AR: 'تخطيط معماري ثنائي الأبعاد، تصميم داخلي، تصميم هيكلي، والعديد من المهارات الأخرى.'
        }
      },
      {
        id: 'q3_6',
        text: {
          EN: 'Skills he is learning:',
          FR: 'Compétences qu’il apprend :',
          AR: 'المهارات التي يتعلمها:'
        },
        answer: {
          EN: 'Continuously improving skills in architecture, interior design, and structural engineering.',
          FR: 'Amélioration continue des compétences en architecture, design intérieur et ingénierie structurelle.',
          AR: 'تحسين مستمر للمهارات في الهندسة المعمارية، التصميم الداخلي والهندسة الهيكلية.'
        }
      },
      {
        id: 'q3_7',
        text: {
          EN: 'His goal in this field:',
          FR: 'Son objectif dans ce domaine :',
          AR: 'هدفه في هذا المجال:'
        },
        answer: {
          EN: 'To always add real value to any project or team I work with.',
          FR: 'Ajouter toujours une vraie valeur à chaque projet ou équipe avec laquelle je travaille.',
          AR: 'إضافة قيمة حقيقية لكل مشروع أو فريق أعمل معه.'
        }
      }
    ]
  },
  {
    id: 'section4',
    title: {
      EN: 'IT / Tech',
      FR: 'IT / Tech',
      AR: 'تكنولوجيا المعلومات'
    },
    questions: [
      {
        id: 'q4_1',
        text: {
          EN: 'Why does he love IT & Tech?',
          FR: 'Pourquoi aime-t-il l’IT & Tech ?',
          AR: 'لماذا يحب التكنولوجيا؟'
        },
        answer: {
          EN: 'Loved this field since childhood; grew with me as a natural passion.',
          FR: 'Aimé ce domaine depuis l’enfance ; une passion naturelle qui a grandi avec moi.',
          AR: 'أحببت هذا المجال منذ صغري، ونما معي كشغف طبيعي على مر السنين.'
        }
      },
      {
        id: 'q4_2',
        text: {
          EN: 'What made him interested?',
          FR: 'Qu’est-ce qui l’a intéressé ?',
          AR: 'ما الذي جعله يهتم؟'
        },
        answer: {
          EN: 'Found comfort & joy in IT while learning from father; used to spend 16+ hours without getting bored.',
          FR: 'Trouvé plaisir et confort en informatique auprès de son père ; passait plus de 16 heures sans s’ennuyer.',
          AR: 'وجدت الراحة والمتعة في تكنولوجيا المعلومات أثناء تعلمي من والدي؛ كنت أقضي أكثر من 16 ساعة أمام الحاسوب دون شعور بالملل.'
        }
      },
      {
        id: 'q4_3',
        text: {
          EN: 'What is he currently learning?',
          FR: 'Qu’apprend-il actuellement ?',
          AR: 'ماذا يتعلم حالياً؟'
        },
        answer: {
          EN: 'Cybersecurity and mobile application development with Flutter.',
          FR: 'Cybersécurité et développement d’applications mobiles avec Flutter.',
          AR: 'أحيانًا أتعلم الأمن السيبراني وتطوير تطبيقات الهواتف باستخدام Flutter.'
        }
      },
      {
        id: 'q4_4',
        text: {
          EN: 'What areas interest him most?',
          FR: 'Quels domaines l’intéressent le plus ?',
          AR: 'ما هي المجالات التي تهمه أكثر؟'
        },
        answer: {
          EN: 'Cybersecurity, mobile apps, AI automation, digital agents.',
          FR: 'Cybersécurité, applications mobiles, automatisation par IA et agents digitaux.',
          AR: 'الأمن السيبراني، التطبيقات المحمولة، الأتمتة بالذكاء الاصطناعي، والوكلاء الرقميون.'
        }
      },
      {
        id: 'q4_5',
        text: {
          EN: 'His goal in this field:',
          FR: 'Son objectif dans ce domaine :',
          AR: 'هدفه في هذا المجال:'
        },
        answer: {
          EN: 'No strict goal; enjoys learning new technologies out of curiosity & passion.',
          FR: 'Pas d’objectif strict ; aime apprendre de nouvelles technologies par curiosité et passion.',
          AR: 'ليس لديه هدف مهني واضح؛ أستمتع فقط بقضاء الوقت في تعلم تقنيات جديدة بدافع الفضول والشغف.'
        }
      }
    ]
  },
  {
    id: 'section5',
    title: {
      EN: 'Gaming',
      FR: 'Gaming',
      AR: 'الألعاب'
    },
    questions: [
      {
        id: 'q5_1',
        text: {
          EN: 'Why does he love gaming?',
          FR: 'Pourquoi aime-t-il le gaming ?',
          AR: 'لماذا يحب الألعاب؟'
        },
        answer: {
          EN: 'Loved gaming since PlayStation 1 & 2; gaming is a passion.',
          FR: 'Adore le gaming depuis PlayStation 1 & 2 ; le gaming est une passion.',
          AR: 'أحب الألعاب منذ أيام بلايستيشن 1 و2؛ الألعاب هي شغفي.'
        }
      },
      {
        id: 'q5_2',
        text: {
          EN: 'Preferred game types:',
          FR: 'Types de jeux préférés :',
          AR: 'أنواع الألعاب المفضلة:'
        },
        answer: {
          EN: 'Open-world, racing, shooters.',
          FR: 'Open-world, course, shooter.',
          AR: 'ألعاب العالم المفتوح، السباقات، ألعاب التصويب.'
        }
      },
      {
        id: 'q5_3',
        text: {
          EN: 'Favorite games:',
          FR: 'Jeux favoris :',
          AR: 'الألعاب المفضلة:'
        },
        answer: {
          EN: 'GTA series, Mafia, Prince of Persia, Call of Duty, Need for Speed, Assassin’s Creed, Forza Horizon, and many more.',
          FR: 'Série GTA, Mafia, Prince of Persia, Call of Duty, Need for Speed, Assassin’s Creed, Forza Horizon, et bien d’autres.',
          AR: 'سلسلة GTA، Mafia، Prince of Persia، Call of Duty، Need for Speed، Assassin’s Creed، Forza Horizon، والكثير غيرها.'
        }
      },
      {
        id: 'q5_4',
        text: {
          EN: 'Learning in gaming:',
          FR: 'Apprentissage dans le gaming :',
          AR: 'التعلم في مجال الألعاب:'
        },
        answer: {
          EN: 'Blender for VFX, Unreal Engine 5 occasionally.',
          FR: 'Blender pour VFX, Unreal Engine 5 occasionnellement.',
          AR: 'أحيانًا أتعلم Blender للـ VFX وUnreal Engine 5 كهواية.'
        }
      },
      {
        id: 'q5_5',
        text: {
          EN: 'Desire to create games:',
          FR: 'Désir de créer des jeux :',
          AR: 'الرغبة في صناعة الألعاب:'
        },
        answer: {
          EN: 'Insha’Allah, why not? Love the field, hope to create my own games.',
          FR: 'Insha’Allah, pourquoi pas ? Adore ce domaine, espère créer mes propres jeux.',
          AR: 'إن شاء الله، لماذا لا؟ أحب هذا المجال وأتمنى صناعة ألعابي الخاصة يوماً ما.'
        }
      }
    ]
  },
  {
    id: 'section6',
    title: {
      EN: 'Wolf & Tools',
      FR: 'Wolf & Outils',
      AR: 'وولف والأدوات'
    },
    questions: [
      {
        id: 'q6_1',
        text: {
          EN: 'Why does Marouan like the Wolf?',
          FR: 'Pourquoi Marouan aime-t-il le loup ?',
          AR: 'لماذا يحب مروان الذئب؟'
        },
        answer: {
          EN: 'I identify with the wolf because it symbolizes independence, leadership, intelligence, and instinct. I chose it as my personal symbol to represent my Sigma mindset.',
          FR: 'Je m’identifie au loup car il symbolise l’indépendance, le leadership, l’intelligence et l’instinct. Je l’ai choisi comme symbole personnel pour représenter ma mentalité Sigma.',
          AR: 'أتعاطف مع الذئب لأنه يرمز إلى الاستقلال، القيادة، الذكاء، والحدس. اخترته كرمز شخصي لتمثيل شخصية Sigma الخاصة بي.'
        }
      },
      {
        id: 'q6_2',
        text: {
          EN: 'Wolf personality traits:',
          FR: 'Traits de personnalité du loup :',
          AR: 'سمات شخصية الذئب:'
        },
        answer: {
          EN: 'Independent, strategic, loyal, intelligent, adaptable.',
          FR: 'Indépendant, stratégique, loyal, intelligent, adaptable.',
          AR: 'مستقل، استراتيجي، مخلص، ذكي، قادر على التكيف.'
        }
      },
      {
        id: 'q6_3',
        text: {
          EN: 'Tools & resources:',
          FR: 'Outils et ressources :',
          AR: 'الأدوات والموارد:'
        },
        answer: {
          EN: 'You can access all my tools and resources here → [Tools Link](https://nexa1337.github.io/tool/) (opens in a new tab)',
          FR: 'Vous pouvez accéder à tous mes outils et ressources ici → [Tools Link](https://nexa1337.github.io/tool/) (ouvre dans un nouvel onglet)',
          AR: 'يمكنك الوصول إلى جميع أدواتي ومواردي هنا → [Tools Link](https://nexa1337.github.io/tool/) (يفتح في نافذة جديدة)'
        }
      }
    ]
  },
  {
    id: 'section7',
    title: {
      EN: 'Secret Area',
      FR: 'Zone Secrète',
      AR: 'المنطقة السرية'
    },
    questions: [
      {
        id: 'q7_1',
        text: {
          EN: 'What is the Secret Area?',
          FR: 'Qu’est-ce que la Zone Secrète ?',
          AR: 'ما هي المنطقة السرية؟'
        },
        answer: {
          EN: 'It is a hidden vault within this website containing exclusive resources. Access is restricted and requires a specific Secret Key to enter.',
          FR: 'C’est un coffre-fort caché dans ce site contenant des ressources exclusives. L’accès est restreint et nécessite une Clé Secrète spécifique pour entrer.',
          AR: 'هي خزانة مخفية داخل هذا الموقع تحتوي على موارد حصرية. الوصول إليها مقيد ويتطلب مفتاحاً سرياً للدخول.'
        }
      },
      {
        id: 'q7_2',
        text: {
          EN: 'What is inside the Secret Area?',
          FR: 'Que trouve-t-on dans la Zone Secrète ?',
          AR: 'ماذا يوجد داخل المنطقة السرية؟'
        },
        answer: {
          EN: 'You will find premium Architectural Tools, Rendering Software, and Games available for free. It is a treasure trove for creators and gamers.',
          FR: 'Vous trouverez des outils d’architecture premium, des logiciels de rendu et des jeux disponibles gratuitement. C’est une mine d’or pour les créateurs et les gamers.',
          AR: 'ستجد أدوات معمارية متميزة، برامج رندر، وألعاب مجانية. إنها كنز للمبدعين واللاعبين.'
        }
      },
      {
        id: 'q7_3',
        text: {
          EN: 'Who is it for?',
          FR: 'Pour qui est-ce ?',
          AR: 'لمن هي؟'
        },
        answer: {
          EN: 'This area is specifically designed for "Gaming People" and "Architects" who need powerful tools and entertainment.',
          FR: 'Cette zone est spécifiquement conçue pour les "Gamers" et les "Architectes" qui ont besoin d’outils puissants et de divertissement.',
          AR: 'تم تصميم هذه المنطقة خصيصاً لـ "مجتمع الألعاب" و "المهندسين المعماريين" الذين يحتاجون إلى أدوات قوية وترفيه.'
        }
      },
      {
        id: 'q7_4',
        text: {
          EN: 'How do I access it?',
          FR: 'Comment y accéder ?',
          AR: 'كيف يمكنني الوصول إليها؟'
        },
        answer: {
          EN: 'You need a Secret Key. If you don’t have it, contact the admin on Instagram or Discord to request it.',
          FR: 'Vous avez besoin d’une Clé Secrète. Si vous ne l’avez pas, contactez l’admin sur Instagram ou Discord pour la demander.',
          AR: 'تحتاج إلى مفتاح سري. إذا لم يكن لديك، تواصل مع المسؤول عبر Instagram أو Discord لطلبه.'
        }
      }
    ]
  }
];

const UI_TEXT = {
  welcome: {
    EN: "Hello! I am Wolf, the static menu bot of Marouan Anouar. Please select a topic below.",
    FR: "Bonjour ! Je suis Wolf, le bot statique de Marouan Anouar. Veuillez sélectionner un sujet ci-dessous.",
    AR: "مرحباً! أنا وولف، الروبوت الخاص بمروان أنور. يرجى اختيار موضوع أدناه."
  },
  select_topic: {
    EN: "Select a topic:",
    FR: "Choisissez un sujet :",
    AR: "اختر موضوعاً:"
  },
  back_to_menu: {
    EN: "⬅ Back to Main Menu",
    FR: "⬅ Retour au Menu Principal",
    AR: "⬅ العودة للقائمة الرئيسية"
  },
  ask_another: {
    EN: "Ask another question about",
    FR: "Poser une autre question sur",
    AR: "اسأل سؤالاً آخر عن"
  },
  restart: {
    EN: "Restart Chat",
    FR: "Redémarrer",
    AR: "بدء من جديد"
  },
  botName: {
    EN: "Wolf",
    FR: "Wolf",
    AR: "وولف"
  }
};

const Chat: React.FC = () => {
  const [lang, setLang] = useState<Language>('EN');
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat
  useEffect(() => {
    resetChat();
  }, [lang]);

  const resetChat = () => {
    setMessages([]);
    setIsTyping(true);
    setTimeout(() => {
      setMessages([{
        id: Date.now().toString(),
        role: 'bot',
        content: UI_TEXT.welcome[lang],
        timestamp: new Date()
      }]);
      setIsTyping(false);
      setActiveSectionId(null);
    }, 800);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeSectionId, isTyping]);

  const handleSectionSelect = (sectionId: string) => {
    const section = STATIC_DATA.find(s => s.id === sectionId);
    if (!section) return;

    // Add User selection as message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: section.title[lang],
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
        // Add Bot response
        const botMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'bot',
            content: lang === 'AR' 
                ? `ماذا تريد أن تعرف عن ${section.title[lang]}؟`
                : lang === 'FR' 
                ? `Que voulez-vous savoir sur ${section.title[lang]} ?`
                : `What would you like to know about ${section.title[lang]}?`,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);
        setActiveSectionId(sectionId);
    }, 600);
  };

  const handleQuestionSelect = (questionId: string) => {
    const section = STATIC_DATA.find(s => s.id === activeSectionId);
    if (!section) return;

    const question = section.questions.find(q => q.id === questionId);
    if (!question) return;

    // User asks question
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: question.text[lang],
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
        // Bot answers
        const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: question.answer[lang],
        timestamp: new Date()
        };
        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);
    }, 800);
  };

  const handleBackToMenu = () => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: UI_TEXT.back_to_menu[lang],
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    setActiveSectionId(null);
    
    setTimeout(() => {
        const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: UI_TEXT.select_topic[lang],
        timestamp: new Date()
        };
        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);
    }, 500);
  };

  // --- Utility to parse Markdown-style links [Text](URL) ---
  const renderMessageContent = (content: string) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }
      parts.push(
        <a 
          key={match.index} 
          href={match[2]} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-500 hover:text-blue-600 underline font-bold transition-colors"
        >
          {match[1]}
        </a>
      );
      lastIndex = linkRegex.lastIndex;
    }
    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }
    return parts.length > 0 ? parts : content;
  };

  const activeSection = STATIC_DATA.find(s => s.id === activeSectionId);
  const isRTL = lang === 'AR';

  // Animation variants
  const messageVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="fixed inset-0 top-16 z-0 flex flex-col bg-slate-50 dark:bg-slate-950 font-sans">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-blue-500/5 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-purple-500/5 rounded-full blur-[100px]"></div>
      </div>

      {/* CHAT HEADER */}
      <div className="px-4 py-3 shrink-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-10 shadow-sm relative w-full">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 dark:from-slate-700 dark:to-slate-950 flex items-center justify-center text-white shadow-lg border border-slate-700/50">
                <Icon name="Wolf" size={20} className="text-blue-400" />
            </div>
            <div>
                <h2 className="font-extrabold text-base md:text-lg text-slate-900 dark:text-white leading-tight">Wolf Chat</h2>
                <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 hidden sm:inline-block">Online</span>
                </div>
            </div>
            </div>
            
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto max-w-[160px] sm:max-w-none">
            {(['EN', 'FR', 'AR'] as Language[]).map((l) => (
                <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap ${
                    lang === l 
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                >
                {l}
                </button>
            ))}
            </div>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto scroll-smooth relative z-0" id="chat-container">
        <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 w-full pb-8">
            {messages.map((msg) => (
            <motion.div
                key={msg.id}
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                className={`flex w-full ${msg.role === 'user' ? (isRTL ? 'justify-start' : 'justify-end') : (isRTL ? 'justify-end' : 'justify-start')}`}
                dir={isRTL ? 'rtl' : 'ltr'}
            >
                <div className={`flex max-w-[85%] md:max-w-[70%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {/* Avatar */}
                <div className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center shrink-0 shadow-md mt-auto border ${
                    msg.role === 'user' 
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600' 
                    : 'bg-slate-900 dark:bg-slate-800 text-blue-400 border-slate-700 dark:border-slate-600'
                }`}>
                    {msg.role === 'user' ? <TbUser size={18} /> : <Icon name="Wolf" size={16} />}
                </div>

                {/* Bubble */}
                <div className={`p-4 md:p-5 rounded-2xl text-[14px] md:text-[15px] leading-relaxed shadow-sm relative ${
                    msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-bl-none'
                } ${isRTL && msg.role === 'bot' ? 'text-right font-sans' : ''}`}>
                    <span className={`${isRTL && msg.role === 'bot' ? 'font-sans' : ''}`}>
                        {renderMessageContent(msg.content)}
                    </span>
                    <span className={`text-[10px] absolute bottom-1 ${msg.role === 'user' ? 'left-3 text-blue-200' : 'right-3 text-slate-400'} opacity-70`}>
                        {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                </div>

                </div>
            </motion.div>
            ))}

            {isTyping && (
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex w-full ${isRTL ? 'justify-end' : 'justify-start'}`}
            >
                <div className="flex gap-3 bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-none border border-slate-100 dark:border-slate-700 shadow-sm items-center ml-12">
                <div className="flex gap-1">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 bg-blue-400 rounded-full"></motion.div>
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-blue-400 rounded-full"></motion.div>
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-blue-400 rounded-full"></motion.div>
                </div>
                <span className="text-xs text-slate-400 ml-2">Wolf is typing...</span>
                </div>
            </motion.div>
            )}
            <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* INPUT AREA (Actions) */}
      <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0 z-20 shadow-[0_-5px_30px_rgba(0,0,0,0.05)] pb-24 md:pb-6">
        <div className="max-w-4xl mx-auto w-full p-3 md:p-6">
          
          <AnimatePresence mode='wait'>
            {/* MAIN MENU */}
            {!activeSectionId && !isTyping && (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3"
              >
                {STATIC_DATA.map((section) => (
                  <motion.button
                    key={section.id}
                    variants={messageVariants}
                    onClick={() => handleSectionSelect(section.id)}
                    className="p-3 md:p-4 text-left rtl:text-right bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 rounded-xl transition-all active:scale-95 group flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm hover:shadow-md gap-2 md:gap-0"
                  >
                    <span className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 block text-xs md:text-sm">
                      {section.title[lang]}
                    </span>
                    <Icon name="ArrowRight" size={16} className={`text-slate-300 group-hover:text-blue-500 transition-colors self-end md:self-auto ${isRTL ? 'rotate-180' : ''}`} />
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* SUB MENU (Questions) */}
            {activeSectionId && activeSection && !isTyping && (
              <motion.div 
                 variants={containerVariants}
                 initial="hidden"
                 animate="visible"
                 exit="hidden"
                 className="flex flex-col gap-2 md:gap-3"
              >
                <div className="flex items-center justify-between mb-1 px-1">
                  <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    {UI_TEXT.ask_another[lang]}
                  </span>
                  <button 
                    onClick={handleBackToMenu}
                    className="text-[10px] md:text-xs font-bold text-blue-500 hover:text-blue-600 flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full transition-colors"
                  >
                    {isRTL ? <Icon name="ArrowRight" size={12}/> : <Icon name="ArrowLeft" size={12}/>}
                    {UI_TEXT.back_to_menu[lang]}
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto no-scrollbar pb-2">
                  {activeSection.questions.map((q) => (
                    <motion.button
                      key={q.id}
                      variants={messageVariants}
                      onClick={() => handleQuestionSelect(q.id)}
                      className="flex-grow text-center sm:text-left rtl:text-right px-4 py-2 md:px-5 md:py-3 bg-white dark:bg-slate-800 hover:bg-blue-600 hover:text-white border border-slate-200 dark:border-slate-700 hover:border-blue-600 rounded-full transition-all text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300 active:scale-95 shadow-sm"
                      dir={isRTL ? 'rtl' : 'ltr'}
                    >
                      {q.text[lang]}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reset Button */}
          <div className="flex justify-center mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/50">
            <button 
              onClick={resetChat}
              className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-slate-400 hover:text-blue-500 transition-colors"
            >
              <TbRefresh size={14} /> {UI_TEXT.restart[lang]}
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Chat;
