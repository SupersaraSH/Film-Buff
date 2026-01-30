const multer = require('multer');

const uploadImage = (folder)=>{
    //configurar donde y como quiero guardar la foto
    const storage = multer.diskStorage({
        destination: `public/images/${folder}`,
        filename : function(req, file, cb){
            let originalName = file.originalname;
            let finalName = Date.now() + '-'+ originalName
            cb(null, finalName)
        }
    });

    //guarda la foto en la ruta descrita arriba y con el nombre que hemos configurado
    const upload = multer({storage:storage}).single("img");
    return upload;
}

module.exports = uploadImage;