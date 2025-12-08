
import { Type } from '@google/genai';

export const andragogyAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    poLD: {
      type: Type.OBJECT,
      properties: {
        authentic: { type: Type.STRING, description: 'Explanation for Authentic principle.' },
        alignment: { type: Type.STRING, description: 'Explanation for Alignment principle.' },
        holistic: { type: Type.STRING, description: 'Explanation for Holistic principle.' },
        feedback: { type: Type.STRING, description: 'Explanation for Feedback principle.' },
        judgement: { type: Type.STRING, description: 'Explanation for Judgement principle.' },
        future: { type: Type.STRING, description: 'Explanation for Future-oriented principle.' },
      },
      required: ['authentic', 'alignment', 'holistic', 'feedback', 'judgement', 'future']
    },
    boud: {
      type: Type.OBJECT,
      properties: {
        situated: { type: Type.STRING, description: 'Explanation for Situated & Embodied.' },
        mediated: { type: Type.STRING, description: 'Explanation for Materially Mediated.' },
        relational: { type: Type.STRING, description: 'Explanation for Relational.' },
      },
      required: ['situated', 'mediated', 'relational']
    },
    billett: {
      type: Type.OBJECT,
      properties: {
        affordances: { type: Type.STRING, description: 'Explanation for Affordances.' },
        guidance: { type: Type.STRING, description: 'Explanation for Guided Participation.' },
      },
      required: ['affordances', 'guidance']
    },
    merrill: {
      type: Type.OBJECT,
      properties: {
        problem: { type: Type.STRING, description: 'Explanation for Problem-centered.' },
        activation: { type: Type.STRING, description: 'Explanation for Activation.' },
        demonstration: { type: Type.STRING, description: 'Explanation for Demonstration.' },
        application: { type: Type.STRING, description: 'Explanation for Application.' },
        integration: { type: Type.STRING, description: 'Explanation for Integration.' },
      },
      required: ['problem', 'activation', 'demonstration', 'application', 'integration']
    },
    bloom: {
      type: Type.OBJECT,
      properties: {
        progression: { type: Type.STRING, description: 'Explanation for Cognitive Progression.' },
      },
      required: ['progression']
    },
    vygotsky: {
      type: Type.OBJECT,
      properties: {
        zpd: { type: Type.STRING, description: 'Explanation for ZPD alignment.' },
        scaffolding: { type: Type.STRING, description: 'Explanation for Scaffolding techniques.' },
        social: { type: Type.STRING, description: 'Explanation for Social Interaction.' },
        mko: { type: Type.STRING, description: 'Explanation for MKO role.' },
      },
      required: ['zpd', 'scaffolding', 'social', 'mko']
    }
  },
  required: ['poLD', 'boud', 'billett', 'merrill', 'bloom', 'vygotsky']
};
