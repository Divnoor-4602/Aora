import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
  ImageGravity,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.divnoor.aora",
  projectId: "67145ca0002b2f0a253a",
  databaseId: "67145f740030c735ecf1",
  userCollectionId: "67145f9600156e202687",
  videoCollectionId: "67145fb60026424b9127",
  storageId: "67199fc500209b7d6301",
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async ({
  email,
  password,
  username,
}: {
  email: string;
  password: string;
  username: string;
}): Promise<object> => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarsUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarsUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(String(error));
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    console.log(error);
    throw new Error(String(error));
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    console.log(currentUser);

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    throw new Error(String(error));
  }
};

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );

    return posts.documents;
  } catch (error) {
    console.log(error);
    throw new Error(String(error));
  }
};

export const getLatestVideos = async () => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );

    return posts.documents;
  } catch (error) {
    console.log(error);
    throw new Error(String(error));
  }
};

export const searchPosts = async (query: string) => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.search("title", query)]
    );

    return posts.documents;
  } catch (error) {
    console.log(error);
    throw new Error(String(error));
  }
};

export const getUserPosts = async (userId: string) => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.equal("creator", userId)]
    );

    return posts.documents;
  } catch (error) {
    console.log(error);
    throw new Error(String(error));
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSessions();

    return session;
  } catch (error) {
    console.log(error);
    throw new Error(String(error));
  }
};

export const getfilePreview = async (fileId: string, type: string) => {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        "top" as ImageGravity,
        100
      );

      if (!fileUrl) throw Error;
    }

    return fileUrl;
  } catch (error) {
    console.log(error);
    throw new Error(String(error));
  }
};

export const uploadFile = async (file: any, type: string) => {
  if (!file) return;

  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
  };

  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getfilePreview(uploadedFile.$id, type);

    return fileUrl;
    return;
  } catch (error) {
    throw new Error(String(error));
  }
};

export const createVideo = async (form: {
  title: string;
  thumbnail: any;
  video: any;
  aiPrompt: string;
  userId: string;
}) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        aiPrompt: form.aiPrompt,
        creator: form.userId,
      }
    );
  } catch (error) {
    console.log(error);
    throw new Error(String(error));
  }
};
