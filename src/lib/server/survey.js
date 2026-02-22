export const TOTAL_QUESTIONS = 10;

export const survey = {
  en: {
    voice: 'Polly.Joanna',
    prompts: {
      languageSelect: "For Spanish, press 1. Otherwise, press pound or stay on the line for English.",
      welcome: "Thank you for calling the Faith and Home survey. Please be aware that your responses will be recorded. We appreciate your time.",
      nameChurch: "Please tell us your first and last name, and the name of the church you belong to. Begin speaking after the tone and press pound when finished.",
      navigationFirst: "You may hang up at any time and call back later to answer more questions. Press pound to start at the beginning, or enter a question number followed by pound to skip ahead.",
      recordingInstruction: "Please begin speaking after the tone and press pound when finished.",
      afterAnswer: "Your response has been recorded. Press pound to continue to the next question. Enter a question number followed by pound to answer a different question. Or you may hang up and call back later.",
      returningNavigation: "Press pound to continue to the next unanswered question, or enter a question number followed by pound to jump to a specific question.",
      invalidQuestion: `Please enter a number between 1 and ${TOTAL_QUESTIONS}, followed by pound.`,
      allDone: "You have now answered all the questions. Thank you for completing the Faith and Home survey. Your responses have been recorded and we are grateful for your time and insight. Goodbye.",
      welcomeBack: (answered) => {
        const list = answered.length > 0
          ? `You have already answered question${answered.length > 1 ? 's' : ''} ${answered.join(', ')}.`
          : "You haven't answered any questions yet.";
        return `Welcome back to the Faith and Home survey. ${list}`;
      },
    },
    questions: [
      { number: 1, text: "Question 1. How would you describe your church's mission or purpose, in your own words?" },
      { number: 2, text: "Question 2. In what ways does your church shape or influence the surrounding neighborhood or community?" },
      { number: 3, text: "Question 3. How has your congregation's membership and participation changed over time, and what factors have influenced those changes?" },
      { number: 4, text: "Question 4. How have patterns of financial giving evolved, and what shapes how people choose to give?" },
      { number: 5, text: "Question 5. How do differences in age, race, income, or beliefs show up in your congregation, and how do they affect people's sense of belonging?" },
      { number: 6, text: "Question 6. What does it mean for your church to feel like home, and has that meaning shifted over time?" },
      { number: 7, text: "Question 7. How do changes in leadership, worship style, demographics, or the building itself affect people's connection to the church?" },
      { number: 8, text: "Question 8. How do church spaces and rituals shape relationships, routines, and spiritual life?" },
      { number: 9, text: "Question 9. How do church life, family life, and the surrounding neighborhood intersect or reinforce one another, and what role does your congregation see itself playing in local housing needs and community care?" },
      { number: 10, text: "Question 10. Looking ahead, what hopes do you have for your church's future role in the community?" },
    ],
  },
  es: {
    voice: 'Polly.Lupe',
    prompts: {
      languageSelect: "Para español, presione 1. De lo contrario, presione el numeral o permanezca en la línea para continuar en inglés.",
      welcome: "Gracias por llamar a la encuesta Fe y Hogar. Tenga en cuenta que sus respuestas serán grabadas. Agradecemos su tiempo.",
      nameChurch: "Por favor díganos su nombre y apellido, y el nombre de la iglesia a la que pertenece. Comience a hablar después del tono y presione el numeral cuando termine.",
      navigationFirst: "Puede colgar en cualquier momento y volver a llamar más tarde para responder más preguntas. Presione el numeral para comenzar desde el principio, o ingrese el número de una pregunta seguido del numeral para avanzar.",
      recordingInstruction: "Por favor comience a hablar después del tono y presione el numeral cuando termine.",
      afterAnswer: "Su respuesta ha sido grabada. Presione el numeral para continuar con la siguiente pregunta. Ingrese el número de una pregunta seguido del numeral para responder una pregunta diferente. O puede colgar y volver a llamar más tarde.",
      returningNavigation: "Presione el numeral para continuar con la siguiente pregunta sin responder, o ingrese el número de una pregunta seguido del numeral para ir a una pregunta específica.",
      invalidQuestion: `Por favor ingrese un número entre 1 y ${TOTAL_QUESTIONS}, seguido del numeral.`,
      allDone: "Ha respondido todas las preguntas. Gracias por completar la encuesta Fe y Hogar. Sus respuestas han sido registradas y agradecemos su tiempo y perspectiva. Adiós.",
      welcomeBack: (answered) => {
        const list = answered.length > 0
          ? `Ya ha respondido la${answered.length > 1 ? 's' : ''} pregunta${answered.length > 1 ? 's' : ''} ${answered.join(', ')}.`
          : "Aún no ha respondido ninguna pregunta.";
        return `Bienvenido de nuevo a la encuesta Fe y Hogar. ${list}`;
      },
    },
    questions: [
      { number: 1, text: "Pregunta 1. ¿Cómo describiría la misión o el propósito de su iglesia, con sus propias palabras?" },
      { number: 2, text: "Pregunta 2. ¿De qué maneras su iglesia da forma o influye en el barrio o la comunidad circundante?" },
      { number: 3, text: "Pregunta 3. ¿Cómo ha cambiado con el tiempo la membresía y la participación de su congregación, y qué factores han influido en esos cambios?" },
      { number: 4, text: "Pregunta 4. ¿Cómo han evolucionado los patrones de donaciones económicas, y qué influye en la forma en que las personas eligen dar?" },
      { number: 5, text: "Pregunta 5. ¿Cómo se manifiestan las diferencias de edad, raza, ingresos o creencias en su congregación, y cómo afectan el sentido de pertenencia de las personas?" },
      { number: 6, text: "Pregunta 6. ¿Qué significa para su iglesia sentirse como un hogar, y ese significado ha cambiado con el tiempo?" },
      { number: 7, text: "Pregunta 7. ¿Cómo afectan los cambios en el liderazgo, el estilo de culto, la demografía o el edificio mismo a la conexión de las personas con la iglesia?" },
      { number: 8, text: "Pregunta 8. ¿Cómo los espacios y rituales de la iglesia dan forma a las relaciones, las rutinas y la vida espiritual?" },
      { number: 9, text: "Pregunta 9. ¿Cómo se entrelazan la vida eclesiástica, la vida familiar y el vecindario circundante, y qué papel ve su congregación en las necesidades locales de vivienda y el cuidado comunitario?" },
      { number: 10, text: "Pregunta 10. De cara al futuro, ¿qué esperanzas tiene para el papel futuro de su iglesia en la comunidad?" },
    ],
  },
};

export function getLang(code) {
  return survey[code] ?? survey.en;
}

export function getNextUnanswered(answered) {
  for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
    if (!answered.includes(i)) return i;
  }
  return null;
}