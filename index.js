import { faker } from '@faker-js/faker'
import { fileURLToPath } from 'url';
import  express  from 'express'
import path from 'path'
import methodOverride from 'method-override'
import mysql from 'mysql2'
const app = express()
const port = 8080


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine","ejs")
app.set("views", path.join(__dirname,"/views"))
app.use(express.urlencoded({ extended : true }))
app.use(express.json())
app.use(methodOverride('_method'))




function createRandomUser(){
    return [
       faker.string.uuid(),
       faker.internet.userName(),
       faker.internet.email(),
       faker.internet.password()
    ];
  }


app.listen(port,() => {
    console.log(`server started on ${port}`)
})

// const users = []

// for (let index = 1; index < 3; index++) {
//     users.push(createRandomUser())
// }


const connection = mysql.createConnection({
    user : "root",
    server : "localhost",
    database : "Users",
    password : "nimesh1132@"
})

// let query = `insert into users values ?`;
// try{
// connection.query(query, [users],(err,result) => {
//      if (err) throw err
//      console.log(result)
// })
// }
// catch(err){
//     console.log(err);
// }

app.get("/", (req,res) => {
    let query = `select count(*) from Users`;
try{
connection.query(query,(err,result) => {
     if (err) throw err
     const data = result[0]['count(*)']
     res.render("users.ejs",{ data })
})
}
catch(err){
    console.log(err);
    res.render("error.ejs")
}
})


app.get("/users", (req,res) => {
    let query = `select * from Users`;
try{
connection.query(query,(err,result) => {
     if (err) throw err
     const user = result
     res.render("home.ejs",{ user })
})
}
catch(err){
    console.log(err);
    res.render("error.ejs")
}
})



app.get("/users/:id", (req,res) => {
    let { id } = req.params
    let query = `select * from Users where id = '${id}' `;
try{
connection.query(query, (err,result) => {
     if (err) throw err
     let user = result[0]
     res.render("edit.ejs",{ user })

})
}
catch(err){
    console.log(err);
    res.render("error.ejs")
}
})



app.patch("/users/:id", (req,res) => {
    let { id } = req.params
    let { username, password } = req.body
    let query = ` select * from users where id = '${id}' `;
try{
connection.query(query, (err,result) => {
     if (err) throw err

    if(result[0].pass === password){
        let query = `update users set username = '${username}' where id = '${id}'`
        connection.query(query, (err,result) => {
            if(err) throw err
            // console.log(res)
            res.redirect("/users")
        })
    }else{
        const  data = 'incorrect password!'
        res.render("error.ejs",{ data })
    }

})
}
catch(err){
    console.log(err);
    res.render("error.ejs")
}

})



app.get("/user/new", (req,res) => {
    res.render("new.ejs")
})



app.post("/users", (req,res) => {
    let { username, email, password } = req.body
    let id = String(faker.string.uuid())
    const user = [id, String(username), String(email), String(password)]
    let query = `insert into users values (?, ?, ?, ?) `;
try{
connection.query(query, user, (err,result) => {
     if (err) throw err
     console.log(result)
     res.redirect("/users")

})
}
catch(err){
    console.log(err);
    res.render("error.ejs")
}
})


app.get("/users/:id/remove", (req,res) => {
        const { id } = req.params
        let q = ` select * from users where id = '${id}' `
      try{
        connection.query(q, (err,result) => {
            if(err) throw err
            const user = result[0]
            res.render("remove.ejs",{ user })
        })
        }
        catch(err){
            console.log(err)
            res.render("error.ejs")
        }
} )




app.delete("/:id/remove", (req,res) => {
    const { id } = req.params
    const { email, password } = req.body 
    let q = ` select * from users where id = '${id}' `
    try{
           connection.query(q, (err,result) => {
             if(err) throw err
             if( result[0].email === email && result[0].pass === password ){
                let query = `delete from users where id = '${id}' `
                connection.query(query, (err, result) => {
                        if (err) throw err
                        console.log(result)
                        res.redirect("/users")
                }) 
             }
             else{
                const data = 'incorrect!! please try again.'
                res.render("error.ejs",{data})
             }
           })
    }
    catch(err){
       console.log(err)
       res.render("error.ejs")
    }

})


