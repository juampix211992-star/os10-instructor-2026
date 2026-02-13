
export interface TrueFalseQuestion {
  id: string;
  category: string;
  question: string;
  isTrue: boolean;
  explanation: string;
}

export const TRUE_FALSE_DATABASE: TrueFalseQuestion[] = [
  // --- LEGISLACIÓN GG.SS. (L) ---
  {
    id: "VF_L001",
    category: "Legal",
    question: "El Guardia de Seguridad puede portar armas de fuego según la Ley 21.659.",
    isTrue: false,
    explanation: "FALSO. El Guardia de Seguridad es un coadyuvante desarmado. Solo los Vigilantes Privados (VV.PP.) pueden portar armas en condiciones específicas autorizadas por la autoridad."
  },
  {
    id: "VF_L002",
    category: "Legal",
    question: "El plazo máximo para denunciar un delito ante Carabineros es de 24 horas.",
    isTrue: true,
    explanation: "VERDADERO. Según el Artículo 4 de la Ley 21.659, el deber de denuncia debe cumplirse en un plazo máximo de 24 horas."
  },
  {
    id: "VF_L003",
    category: "Legal",
    question: "La credencial de Guardia de Seguridad (OS10) tiene una vigencia de 3 años.",
    isTrue: false,
    explanation: "FALSO. La nueva normativa extiende la vigencia a 4 años, requiriendo re-entrenamiento técnico antes de la renovación."
  },
  {
    id: "VF_L004",
    category: "Legal",
    question: "El seguro de vida mínimo de 500 UF es obligatorio y debe ser costeado por la empresa empleadora.",
    isTrue: true,
    explanation: "VERDADERO. Este seguro es irrenunciable y debe ser costeado íntegramente por la empresa empleadora para proteger al guardia ante riesgos en el ejercicio de su función."
  },
  {
    id: "VF_L005",
    category: "Legal",
    question: "Un Guardia de Seguridad puede trabajar sin haber completado el 4to medio.",
    isTrue: false,
    explanation: "FALSO. La Ley 21.659 profesionaliza la seguridad privada exigiendo el 4to medio completo como requisito mínimo."
  },

  // --- PRIVACIDAD Y DATOS (P) ---
  {
    id: "VF_P001",
    category: "Privacidad",
    question: "Los derechos ARCO permiten al ciudadano acceder, rectificar, cancelar u oponerse al tratamiento de sus datos personales.",
    isTrue: true,
    explanation: "VERDADERO. Los derechos ARCO (Acceso, Rectificación, Cancelación y Oposición) son las facultades que tiene el titular para controlar sus datos personales."
  },
  {
    id: "VF_P002",
    category: "Privacidad",
    question: "El Principio de Finalidad permite usar datos personales para cualquier propósito si el titular ya los compartió.",
    isTrue: false,
    explanation: "FALSO. El Principio de Finalidad establece que los datos solo pueden usarse para los fines específicos para los cuales fueron recolectados."
  },
  {
    id: "VF_P003",
    category: "Privacidad",
    question: "Los datos sensibles (salud, ideología) requieren autorización expresa del titular para ser tratados.",
    isTrue: true,
    explanation: "VERDADERO. Los Datos Sensibles tienen protección especial y su tratamiento está restringido por ley, requiriendo consentimiento explícito."
  },
  {
    id: "VF_P004",
    category: "Privacidad",
    question: "Un guardia puede entregar video de vigilancia a un particular que lo solicita.",
    isTrue: false,
    explanation: "FALSO. El video de vigilancia solo puede entregarse a Carabineros, PDI o Fiscalía. Los particulares no tienen acceso directo sin orden judicial."
  },

  // --- DERECHOS HUMANOS (H) ---
  {
    id: "VF_H001",
    category: "DD.HH.",
    question: "El Artículo 19 N°2 de la Constitución garantiza la igualdad ante la ley sin discriminación arbitraria.",
    isTrue: true,
    explanation: "VERDADERO. Hombres y mujeres son iguales ante la ley sin diferencias arbitrarias según el Artículo 19 N°2."
  },
  {
    id: "VF_H002",
    category: "DD.HH.",
    question: "Los Derechos Humanos caducan después de cierto tiempo si no se ejercen.",
    isTrue: false,
    explanation: "FALSO. Los DD.HH. son imprescriptibles, es decir, no pierden su vigencia por el paso del tiempo."
  },
  {
    id: "VF_H003",
    category: "DD.HH.",
    question: "La Convención Belém do Pará se enfoca en la protección de la mujer contra la violencia.",
    isTrue: true,
    explanation: "VERDADERO. Es el tratado fundamental reconocido en Chile para la protección de la mujer frente a cualquier forma de violencia."
  },
  {
    id: "VF_H004",
    category: "DD.HH.",
    question: "El Recurso de Amparo puede interponer cualquier persona ante una detención arbitraria.",
    isTrue: true,
    explanation: "VERDADERO. El Recurso de Amparo protege a cualquier persona ante una detención ilegal o privación arbitraria de libertad."
  },

  // --- ÉTICA Y PROBIDAD (E) ---
  {
    id: "VF_E001",
    category: "Ética",
    question: "La Probidad exige que el guardia anteponga el interés general al beneficio personal.",
    isTrue: true,
    explanation: "VERDADERO. La Probidad es un principio ético que exige conducta honesta y leal, privilegiando siempre el bien común."
  },
  {
    id: "VF_E002",
    category: "Ética",
    question: "La Ley Zamudio (20.609) permite denuncias de discriminación con un plazo máximo de 30 días.",
    isTrue: false,
    explanation: "FALSO. El plazo es de 90 días corridos desde que ocurre el hecho para interponer la acción judicial según la Ley 20.609."
  },
  {
    id: "VF_E003",
    category: "Ética",
    question: "La Ley 21.675 establece medidas integrales contra la violencia de género hacia las mujeres.",
    isTrue: true,
    explanation: "VERDADERO. La Ley 21.675 es la ley integral para la prevención, sanción y erradicación de la violencia hacia las mujeres."
  },
  {
    id: "VF_E004",
    category: "Ética",
    question: "Un guardia puede aceptar un regalo de un visitante sin informar a la jefatura siempre que sea pequeño.",
    isTrue: false,
    explanation: "FALSO. La Probidad exige rechazar cualquier tipo de beneficio personal e informar por conducto regular a la jefatura ante intentos de soborno."
  },

  // --- PREVENCIÓN DE RIESGOS (R) ---
  {
    id: "VF_R001",
    category: "Res. 2183",
    question: "El uniforme oficial del GG.SS. debe incluir camisa Gris Perla según la Res. 2183.",
    isTrue: true,
    explanation: "VERDADERO. La camisa Gris Perla es el color reglamentario obligatorio para diferenciar claramente al guardia de otras instituciones."
  },
  {
    id: "VF_R002",
    category: "Res. 2183",
    question: "El chaleco reflectante debe portarse sobre la camisa con la leyenda 'SEGURIDAD PRIVADA' en la espalda.",
    isTrue: true,
    explanation: "VERDADERO. El chaleco rojo fluorescente es obligatorio y debe llevar la leyenda 'SEGURIDAD PRIVADA' en la espalda para identificación visual."
  },
  {
    id: "VF_R003",
    category: "Res. 2183",
    question: "El bastón de seguridad puede tener una longitud máxima de 80 centímetros.",
    isTrue: false,
    explanation: "FALSO. El bastón máximo autorizado es de 60 cm, fabricado en policarbonato, de uso estrictamente defensivo."
  },

  // --- PRIMEROS AUXILIOS (PA) ---
  {
    id: "VF_PA001",
    category: "Primeros Auxilios",
    question: "El protocolo P.A.S. incluye: Proteger, Avisar y Socorrer.",
    isTrue: true,
    explanation: "VERDADERO. El protocolo P.A.S. es fundamental: PROTEGER la escena, AVISAR a emergencias (131) y SOCORRER según capacidad."
  },
  {
    id: "VF_PA002",
    category: "Primeros Auxilios",
    question: "La maniobra de RCP consiste en 30 compresiones torácicas seguidas de 2 insuflaciones.",
    isTrue: true,
    explanation: "VERDADERO. Esta es la proporción estándar de Reanimación Cardiopulmonar (30:2) avalada internacionalmente."
  },
  {
    id: "VF_PA003",
    category: "Primeros Auxilios",
    question: "La maniobra de Heimlich se utiliza para casos de quemaduras graves.",
    isTrue: false,
    explanation: "FALSO. La maniobra de Heimlich es una técnica de compresión abdominal para desobstruir la vía aérea ante atragantamiento total."
  },
  {
    id: "VF_PA004",
    category: "Primeros Auxilios",
    question: "El número de emergencia para solicitar ambulancia es el 131.",
    isTrue: true,
    explanation: "VERDADERO. El 131 es el número de emergencia nacional para servicios de ambulancia y paramédicos en Chile."
  },

  // --- SEGURIDAD DE INSTALACIONES (I) ---
  {
    id: "VF_I001",
    category: "Instalaciones",
    question: "El control de acceso es el primer anillo de defensa en la seguridad de una instalación.",
    isTrue: true,
    explanation: "VERDADERO. El control de acceso es el punto más crítico para prevenir intrusiones no autorizadas."
  },
  {
    id: "VF_I002",
    category: "Instalaciones",
    question: "Los incendios tipo 'C' corresponden a sólidos como madera y papel.",
    isTrue: false,
    explanation: "FALSO. Los incendios tipo A son de sólidos (papel, madera). Los tipo C son incendios eléctricos."
  },
  {
    id: "VF_I003",
    category: "Instalaciones",
    question: "El extintor PQS (Polvo Químico Seco) puede usarse para fuegos ABC.",
    isTrue: true,
    explanation: "VERDADERO. El extintor PQS es versátil y se usa para incendios tipo A, B y C."
  },
  {
    id: "VF_I004",
    category: "Instalaciones",
    question: "El equipo de protección personal (EPP) es opcional en labores de seguridad.",
    isTrue: false,
    explanation: "FALSO. El uso de EPP (calzado de seguridad, chaleco reflectante) es obligatorio para todo guardia."
  }
];
