import mongoose, { Schema, model } from 'mongoose';

const FolderSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    is_deleted: {
      type: Boolean,
      default: false
    }
  },

  {
    timestamps: true
  }
);

const Folder = model('Folder', FolderSchema);

export default Folder;
