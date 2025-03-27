# Install dependencies
npm install

# Create ENV file
MONGODB_URI=mongodb://localhost:27017/chat_db
PORT=5001
JWT_SECRET=12345
APP_URI=http://localhost:5173
APP_AWS_ACCESS_KEY=
APP_AWS_SECRET_ACCESS_KEY=
APP_AWS_REGION=
APP_AWS_BUCKET_NAME=chitchat-public-keys

# Run
npm run dev