import * as FileSystem from 'expo-file-system';

export async function createFileWithData(
  fileName: string,
  data: string
): Promise<string> {
  // Get the document directory path
  const fileUri = `${FileSystem.documentDirectory}${fileName}`;
  // Write the data to the file
  await FileSystem.writeAsStringAsync(fileUri, data, { encoding: FileSystem.EncodingType.UTF8 });
  // Return the file URI
  return fileUri;
}
