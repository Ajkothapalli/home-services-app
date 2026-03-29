export interface FormField {
  fieldId: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'date' | 'boolean';
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export interface CollectFormInput {
  formId: string;
  fields: FormField[];
  title: string;
}

export type FormData = Record<string, string | number | boolean | string[]>;

/**
 * UI skill: presents a dynamic form to the user and returns the collected data.
 * Used for structured data collection that does not have a dedicated screen.
 */
export async function collectForm(
  input: CollectFormInput,
): Promise<FormData> {
  // TODO: Render a modal or screen with the provided fields
  // TODO: Validate required fields before resolving
  throw new Error(`collectForm is a UI skill and must be invoked from a React component. Form: ${input.formId}`);
}
