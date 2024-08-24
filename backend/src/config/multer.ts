import multer from "multer";
import ErrorDetail from "../model/error.model";
import { sanitizeMimeType } from "../utils/mimeTypeSanitizer";

// ----------------------------------------------------------------------------------------------------------
// Avatar Upload
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
  fileSize: 2097152 //2 mb
};

const uploadPP = multer({storage:storage, limits:limit, fileFilter:fileFilter}).single('picture');

export {uploadPP}

// ----------------------------------------------------------------------------------------------------------
// Checklist File Upload
const checklistFileStorage= multer.diskStorage(
  { 
    destination:(req, file, callback) => {
      callback(null, `${__dirname}/../uploads/checklist`)
    },
    filename:(req, file, callback) => {
      const fileExt = sanitizeMimeType(file.mimetype);
      callback(null, `checklist_${req?.body?.id}_${req?.body?.option}.${fileExt}`)
    }
  }
);

const checklistFileFilter = (req: any, file: any, callback: any) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/x-zip-compressed' ||
    file.mimetype === 'application/zip' ||
    file.mimetype === 'application/vnd.rar'
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

const checklistFileLimit = {
  fileSize: 5242880 //5 mb
};

const uploadChecklistFile = multer({
  storage:checklistFileStorage, 
  limits:checklistFileLimit, 
  fileFilter:checklistFileFilter
}).single('file');

export {uploadChecklistFile}

// ----------------------------------------------------------------------------------------------------------
// Standardization File Upload
const stdFileStorage= multer.diskStorage(
  { 
    destination:(req, file, callback) => {
      callback(null, `${__dirname}/../uploads/standardization`)
    },
    filename:(req, file, callback) => {
      const fileExt = sanitizeMimeType(file.mimetype);
      const {kppnId, periodId, standardizationId, month, timeStamp} = req.body;
      callback(null, `std_${kppnId}_${periodId}${month}${standardizationId}_${timeStamp}.${fileExt}`)
    }
  }
);

const stdFileFilter = (req: any, file: any, callback: any) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/x-zip-compressed' ||
    file.mimetype === 'application/zip' ||
    file.mimetype === 'application/vnd.rar'
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

const stdFileLimit = {
  fileSize: 5242880 //5 mb
};

const uploadStdFile = multer({
  storage: stdFileStorage, 
  limits: stdFileLimit, 
  fileFilter: stdFileFilter
}).single('stdFile');

export {uploadStdFile}

// ----------------------------------------------------------------------------------------------------------
// Worksheet File Upload
const wsJunctionFileStorage= multer.diskStorage(
  { 
    destination:(req, file, callback) => {
      callback(null, `${__dirname}/../uploads/worksheet`)
    },
    filename:(req, file, callback) => {
      const fileExt = sanitizeMimeType(file.mimetype);
      const {worksheetId, checklistId, kppnId, option} = req.body;
      callback(null, `ch${checklistId}_file${option}_kppn${kppnId}_${worksheetId}.${fileExt}`)
    }
  }
);

const wsJunctionFileFilter = (req: any, file: any, callback: any) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/x-zip-compressed' ||
    file.mimetype === 'application/zip' ||
    file.mimetype === 'application/vnd.rar'
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

const wsJunctionFileLimit = {
  fileSize: 5242880 //5 mb
};

const uploadWsJunctionFile = multer({
  storage: wsJunctionFileStorage, 
  limits: wsJunctionFileLimit, 
  fileFilter: wsJunctionFileFilter
}).single('wsJunctionFile');

export {uploadWsJunctionFile}

// ----------------------------------------------------------------------------------------------------------
// Gallery File Upload
const galleryStorage= multer.diskStorage(
  { 
    destination:(req, file, callback) => {
      callback(null, `${__dirname}/../uploads/image`)
    },
    filename:(req, file, callback) => {
      const {miscId, value, detail1, detail2, detail3} = req.body;
      console.log(value);
      callback(null, value)
    }
  }
);

const galleryFileFilter = (req: any, file: any, callback: any) => {
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    callback(null, true)
  }else{
    callback(null, false)
  }
}; 

const galleryLimit = {
  fileSize: 2097152 //2 mb
};

const uploadGallery = multer({storage:galleryStorage, limits:galleryLimit, fileFilter:galleryFileFilter}).single('gallery');

export {uploadGallery}