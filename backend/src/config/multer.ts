import multer from "multer";
import ErrorDetail from "../model/error.model";


const storage= multer.diskStorage(
  { 
    destination:(req, file, callback) => {
      callback(null, `${__dirname}/../uploads/avatar`)
    },
    filename:(req, file, callback) => {
      const fileExt = file.mimetype.split("/")[1];
      callback(null, `avatar_${req.payload.username}.${fileExt}`)
    }
  }
);

const fileFilter = (req: any, file: any, callback: any) => {
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    callback(null, true)
  }else{
    callback(null, false)
  }
}; 

const limit = {
  fileSize: 12582912
};

const uploadPP = multer({storage:storage, limits:limit, fileFilter:fileFilter}).single('picture');

export {uploadPP}

// ----------------------------------------------------------------------------------------------------------
const checklistFileStorage= multer.diskStorage(
  { 
    destination:(req, file, callback) => {
      callback(null, `${__dirname}/../uploads/checklist`)
    },
    filename:(req, file, callback) => {
      const fileExt = file.mimetype.split("/")[1];
      callback(null, `checklist_${req?.body?.id}_${req?.body?.option}.${fileExt}`)
    }
  }
);

const checklistFileFilter = (req: any, file: any, callback: any) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/zip'
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

const checklistFileLimit = {
  fileSize: 12582912
};

const uploadChecklistFile = multer({
  storage:checklistFileStorage, 
  limits:checklistFileLimit, 
  fileFilter:checklistFileFilter
}).single('file');

export {uploadChecklistFile}