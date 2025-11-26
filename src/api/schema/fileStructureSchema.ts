import { Type } from '@google/genai';

// Schema for the deepest level of files/folders explicitly defined.
const fileNodeSchemaLevel3 = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: 'The name of the file or folder.' },
    type: { type: Type.STRING, description: "Either 'file' or 'folder'." },
    content: { type: Type.STRING, description: 'The content of the file. Empty for folders.' },
    // No 'children' property here to stop recursion in the explicit schema definition.
  },
  required: ['name', 'type']
};

// Schema for level 2 nodes, which can contain level 3 nodes.
const fileNodeSchemaLevel2 = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: 'The name of the file or folder.' },
    type: { type: Type.STRING, description: "Either 'file' or 'folder'." },
    content: { type: Type.STRING, description: 'The content of the file. Empty for folders.' },
    children: {
      type: Type.ARRAY,
      description: 'An array of nested file or folder nodes. Empty for files.',
      items: fileNodeSchemaLevel3
    }
  },
  required: ['name', 'type']
};

// Schema for level 1 nodes, which can contain level 2 nodes.
const fileNodeSchemaLevel1 = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: 'The name of the file or folder.' },
    type: { type: Type.STRING, description: "Either 'file' or 'folder'." },
    content: { type: Type.STRING, description: 'The content of the file. Empty for folders.' },
    children: {
      type: Type.ARRAY,
      description: 'An array of nested file or folder nodes. Empty for files.',
      items: fileNodeSchemaLevel2
    }
  },
  required: ['name', 'type']
};

export const fileStructureSchema = {
    type: Type.OBJECT,
    properties: {
        fileStructure: {
            type: Type.ARRAY,
            description: 'A complete file and folder structure for the project. The schema explicitly supports up to 3 levels of nesting, but deeper structures are possible.',
            items: fileNodeSchemaLevel1,
        }
    },
    required: ['fileStructure']
};
