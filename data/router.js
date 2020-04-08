const express = require ("express")
const DB = require("./db.js")

const router = express.Router()

router.get("/", (req, res) => {
    try {
        DB.find()
        .then(item=> {
            res.status(200).json(item)
        })
     }
     catch(error){
         res.status(500).json({errorMessage: "The posts informations could not be retrieved"})
     }
    
})

router.get("/:id", (req, res) => {
    const id = req.params.id
        try{
            DB.findById(id)
            .then(post =>{
                if(post.length) {
                    res.status(200).json(post);
                } else {
                    res.status(404).json({errorMessage: "The ID doesn't exist"})
                }
            })
        }
        catch{
       res.status(500).json({errorMessage: "The posts informations could not be retrieved"}) 
    }  
})

router.get("/:id/comments", (req, res) => {
    try{
        DB.findCommentById(req.params.id)
        .then(post =>{
            if(post.length) {
                res.status(200).json(post);
            } else {
                res.status(404).json({errorMessage: "The ID doesn't exist"})
            }
        })
    }
    catch{
   res.status(500).json({errorMessage: "The posts informations could not be retrieved"}) 
}  
})

router.post("/", (req,res) => {
    const ItemInfo = req.body
    if (ItemInfo.title == "" || ItemInfo.contents == "") {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post."})
    } else {
        try {
            DB.insert(req.body)
            .then(item => {
            res.status(201).json(item)
           })
        }
        catch {
            res.status(500).json({ error: "There was an error while saving the post to the database"})
        }
    }
    
})

router.post("/:id/comments", (req,res) => {
    const id = req.body.post_id

    const dbid = DB.find((item) => item.id == id)
    if (req.body.text == "") {
        res.status(400).json({ errorMessage: "Please provide text for the comment."})
    } if (!dbid) {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
    } else {
        try{
            DB.insertComment(req.body)
            .then(comment => {
                res.status(200).json(comment)
            })
        }
        catch {
            res.status(500).json({ error: "There was an error while saving the post to the database"})
        }
    }

})

router.delete('/:id', (req, res) => {
     DB.findById(req.params.id)
    .then(item=> {
        DB.remove(req.params.id) 
        .then (count => {
            if (count > 0 ) {
                res.status(200).json(item)
            }
            else {
                res.status(404).json({message: 'The object could not be found'});
            }
    })
    .catch(error => {
        res.status(500).json({message: "Server error"})
    });
  });
})

  router.put('/:id', (req, res) => {
    const changes = req.body;
    if (req.body.text == "" || req.body.contents == "") {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post."})
    } else {
        DB.update(req.params.id, changes)
        .then(count => {
            if (count>0){
             DB.findById(req.params.id)
             .then(item => {
                res.status(200).json(item);
             })
             
            } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." });
          }
        })
        .catch(error => {
          console.log(error);
          res.status(500).json({
            error: "The post information could not be modified." ,
          });
        });
      }
    })
   
  




module.exports = router;