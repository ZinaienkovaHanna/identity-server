export const schema = {
    type: 'object',
    required: [
        'FIREBASE_API_KEY',
        'FIREBASE_AUTH_DOMAIN',
        'FIREBASE_PROJECT_ID',
        'FIREBASE_STORAGE_BUCKET',
        'FIREBASE_MESSAGING_SENDER_ID',
        'FIREBASE_APP_ID',
        'FIREBASE_MEASUREMENT_ID',
    ],
    properties: {
        FIREBASE_API_KEY: { type: 'string' },
        FIREBASE_AUTH_DOMAIN: { type: 'string' },
        FIREBASE_PROJECT_ID: { type: 'string' },
        FIREBASE_STORAGE_BUCKET: { type: 'string' },
        FIREBASE_MESSAGING_SENDER_ID: { type: 'string' },
        FIREBASE_APP_ID: { type: 'string' },
        FIREBASE_MEASUREMENT_ID: { type: 'string' },
    },
};
