import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.APP_AWS_REGION,
});

export async function uploadPublicKey(userId, publicKeyBase64) {
  try {
    const params = {
      Bucket: process.env.APP_AWS_BUCKET_NAME,
      Key: `${userId}-public-key.txt`,
      Body: publicKeyBase64,
      ContentType: "text/plain",
    };
    await s3.upload(params).promise();
    console.log(`Public key uploaded for ${userId}`);
  } catch (error) {
    console.error(`Error uploading public key: ${error.message}`);
    throw error;
  }
}

export async function getPublicKey(userId) {
  try {
    const params = {
      Bucket: process.env.APP_AWS_BUCKET_NAME,
      Key: `${userId}-public-key.txt`,
    };
    const data = await s3.getObject(params).promise();
    return data.Body.toString("utf-8");
  } catch (error) {
    if (error.code === "NoSuchKey") {
      console.error(`Public key not found for ${userId}`);
      return null;
    }
    console.error(`Error retrieving public key: ${error.message}`);
    throw error;
  }
}