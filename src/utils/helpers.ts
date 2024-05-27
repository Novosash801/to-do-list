type GeneratedId = () => string;
const generatedId: GeneratedId = () => (
    Math.random().toString(16).slice(2) + new Date().getTime().toString(36)
);

export default generatedId;