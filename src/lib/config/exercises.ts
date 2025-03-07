import { Exercise } from '../types';

// Definición base de ejercicios sin los valores específicos de cada entrenamiento
export const exercises: Omit<Exercise, 'weight' | 'weightUnit' | 'barWeight' | 'sets' | 'reps' | 'effort'>[] = [
  // PUSH
  {
    id: 'benchpress',
    name: 'Press de banca con barra',
    type: 'Push',
    emoji: '🏋️',
    alternative: {
      id: 'dumbbell-benchpress',
      name: 'Press de banca con mancuernas',
      emoji: '💪'
    }
  },
  {
    id: 'shoulder-press',
    name: 'Press militar con barra',
    type: 'Push',
    emoji: '🏋️',
    alternative: {
      id: 'dumbbell-shoulder-press',
      name: 'Press de hombros con mancuernas',
      emoji: '💪'
    }
  },
  {
    id: 'butterfly',
    name: 'Butterfly en máquina',
    type: 'Push',
    emoji: '🦋',
    alternative: {
      id: 'peck-deck',
      name: 'Peck deck (aperturas en máquina)',
      emoji: '🦅'
    }
  },
  {
    id: 'tricep-extension',
    name: 'Extensión de tríceps en polea',
    type: 'Push',
    emoji: '💪',
    alternative: {
      id: 'french-press',
      name: 'Press francés con barra Z',
      emoji: '🥖'
    }
  },
  {
    id: 'lateral-raises',
    name: 'Elevaciones laterales con mancuernas',
    type: 'Push',
    emoji: '🏔️',
    alternative: {
      id: 'cable-lateral-raises',
      name: 'Elevaciones laterales en polea',
      emoji: '⛰️'
    }
  },
  {
    id: 'tricep-pushdown',
    name: 'Tricep pushdown',
    type: 'Push',
    emoji: '👇',
    alternative: {
      id: 'dips',
      name: 'Fondos en paralelas',
      emoji: '🔽'
    }
  },
  
  // PULL
  {
    id: 'deadlift',
    name: 'Peso muerto convencional',
    type: 'Pull',
    emoji: '🏋️',
    alternative: {
      id: 'sumo-deadlift',
      name: 'Sumo deadlift',
      emoji: '🏋️‍♀️'
    }
  },
  {
    id: 'pull-ups',
    name: 'Pull-ups',
    type: 'Pull',
    emoji: '🧗',
    alternative: {
      id: 'lat-pulldown',
      name: 'Lat pulldown en máquina',
      emoji: '⬇️'
    }
  },
  {
    id: 'cable-row',
    name: 'Cable row',
    type: 'Pull',
    emoji: '🚣',
    alternative: {
      id: 'machine-row',
      name: 'Remo en máquina',
      emoji: '🚣‍♀️'
    }
  },
  {
    id: 'bicep-curl',
    name: 'Bicep curl con barra',
    type: 'Pull',
    emoji: '💪',
    alternative: {
      id: 'dumbbell-curl',
      name: 'Bicep curl con mancuernas',
      emoji: '🔄'
    }
  },
  {
    id: 'inverse-butterfly',
    name: 'Inverse butterfly',
    type: 'Pull',
    emoji: '🦋',
    alternative: {
      id: 'reverse-fly',
      name: 'Reverse fly en cable',
      emoji: '🦅'
    }
  },
  {
    id: 'hammer-curl',
    name: 'Curl martillo',
    type: 'Pull',
    emoji: '🔨',
    alternative: {
      id: 'cable-hammer-curl',
      name: 'Hammer curl en cable',
      emoji: '⚡'
    }
  },
  
  // LEGS
  {
    id: 'squats',
    name: 'Sentadillas con barra',
    type: 'Legs',
    emoji: '🏋️',
    alternative: {
      id: 'front-squats',
      name: 'Sentadillas frontales con barra',
      emoji: '🏋️‍♀️'
    }
  },
  {
    id: 'bulgarian-squats',
    name: 'Sentadillas búlgaras',
    type: 'Legs',
    emoji: '🇧🇬',
    alternative: {
      id: 'lunges',
      name: 'Zancadas con mancuernas',
      emoji: '🚶'
    }
  },
  {
    id: 'leg-press',
    name: 'Leg press',
    type: 'Legs',
    emoji: '🦵',
    alternative: {
      id: 'hack-squat',
      name: 'Sentadilla hack',
      emoji: '🔨'
    }
  },
  {
    id: 'leg-extension',
    name: 'Extensión de piernas en máquina',
    type: 'Legs',
    emoji: '📏',
    alternative: {
      id: 'leg-extension-alt',
      name: 'Variante de extensión de piernas',
      emoji: '📐'
    }
  },
  {
    id: 'leg-curl',
    name: 'Leg curl',
    type: 'Legs',
    emoji: '🦵',
    alternative: {
      id: 'leg-curl-machine',
      name: 'Máquina de leg curl',
      emoji: '⚙️'
    }
  },
  {
    id: 'abduction',
    name: 'Abducción en máquina',
    type: 'Legs',
    emoji: '➡️',
    alternative: {
      id: 'adduction',
      name: 'Aducción en máquina',
      emoji: '⬅️'
    }
  },
  {
    id: 'calf-press',
    name: 'Elevación de pantorrillas sentado',
    type: 'Legs',
    emoji: '👣',
    alternative: {
      id: 'standing-calf-raise',
      name: 'Elevaciones de pantorrillas de pie',
      emoji: '🧍'
    }
  }
];

// Función auxiliar para filtrar ejercicios por tipo
export function getExercisesForType(type: 'Push' | 'Pull' | 'Legs') {
  return exercises.filter(exercise => exercise.type === type);
} 