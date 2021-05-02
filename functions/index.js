const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

//------------------referal count----------------------------------------------------------------------------------

exports.ReferPoint = functions.firestore
    .document('Orders/{docid}')
    .onWrite(async (change, context) => {
        docid=context.params.docid;
      const data = change.after.data();
      const dstat=data.Status;
      const previousData = change.before.data();
    const prestat=previousData.Status;
    let UId=data.User['UserId'];
    console.log(UId);
    let Db=db.collection("Users").doc(UId)
      if(dstat==='Paid' && prestat==='Issued'){
Db.get().then(snapshot=>{
    let RefId=snapshot.data().Referal_Id;
   if (RefId){ 
    console.log(RefId);
   db.collection("Users").doc(RefId).get().then(doc=>{
       // let fields =doc.data().Referal;
       let score=Number(doc.data().Referal["Score"]);
       let Refs={
           Referal:{
               Score:score+10
           }
           };
           db.collection("Users").doc(RefId).update(Refs)
           
    //    if (fields){ 
    //     let score=Number(doc.data().Referal["Score"]);
    // let Refs={
    //     Referal:{
    //         Score:score+10
    //     }
    //     };
    //     db.collection("Users").doc(RefId).update(Refs)
    
    //    }else{
    //     let Ref={ Referal:{
    //         Score:10
    //     }
    //     };
    //     db.collection("Users").doc(RefId).update(Ref).then(doc=>{
    //         console.log("created referal")
    //     });
    //    }
    })
   
   }else{
      console.log("NO Referal_Id Found!")
      
   }
})
      }else if(dstat==='Paid' && prestat==='Error'){
         // console.log("refer up error")
  
  
Db.get().then(snapshot=>{
    let RefId=snapshot.data().Referal_Id;
   if (RefId){ 
   db.collection("Users").doc(RefId).get().then(doc=>{
    
   // let fields =doc.data().Referal;
      // if (fields){ 
        let score=Number(doc.data().Referal["Score"]);
    let Refs={
        Referal:{
            Score:score+10
        }
        };
        db.collection("Users").doc(RefId).update(Refs)
    
    //    }else{
    //     let Ref={ Referal:{
    //         Score:10
    //     }
    //     };
    //     db.collection("Users").doc(RefId).update(Ref).then(doc=>{
    //         console.log("created referal")
    //     });
    //    }
    })
    
   }else{
      console.log("NO Referal_Id Found!")
     
   }
})
      }else{
          console.log("No Referal Found:(")
      }
    });
//------------------referal count----------------------------------------------------------------------------------

exports.RefScore = functions.https.onRequest(async (req, res) => {
    let userId=req.body.userid;
  
 let Score=  await  db.collection("Users").doc(userId).get().then(snap=>{
    let data = snap.data();
    let sc =Number(data.Referal["Score"]);
    return sc
 })
 let code=  await  db.collection("Users").doc(userId).get().then(snap=>{
    let data = snap.data();
    let gcode= data.Referal_Code;
    return gcode
 })
res.json({"Score":Score,
       "Referal_Code":code
});
    });
//------------------------referal generator-------------------

exports.ReferGenerator = functions.firestore
    .document('Users/{docid}')
    .onCreate(async (snapshot, context) =>{
        docid=context.params.docid;
        var generator ='';
        var characters='ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyskiouhjnmbhj'
      for (var i, i=0;i<6;i++){
        generator +=characters.charAt(Math.floor(Math.random() * characters.length))
      }
       let code =generator
 db.collection("Users").doc(docid).update({
    "Referal_Code": code,
    "Referal":{
        "Score":Number(0)
    },
    "Referal_Id":""
}).then(snap=>{
    console.log("referal code generated")
})
    });













// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
