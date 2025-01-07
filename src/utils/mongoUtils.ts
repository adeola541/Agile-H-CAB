import { Types } from 'mongoose';

export const toObjectId = (id: string) => {
  try {
    return new Types.ObjectId(id);
  } catch (error) {
    throw new Error('Invalid ID format');
  }
};

export const isValidObjectId = (id: string) => {
  return Types.ObjectId.isValid(id);
};

export const formatMongoData = (data: any) => {
  if (!data) return null;
  
  if (Array.isArray(data)) {
    return data.map(item => ({
      ...item,
      id: item._id.toString(),
      _id: undefined
    }));
  }
  
  return {
    ...data,
    id: data._id.toString(),
    _id: undefined
  };
};
