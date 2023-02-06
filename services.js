async function listDatabases(client){
    try{
        const dbList = await client.db().admin().listDatabases();
        // console.log(dbList);
        dbList.databases.forEach(element => {
            console.log(element.name);
        });
    }catch(err){
        console.log(err);
    }
    
}

async function insertFood(client , data){
    try{
        const result = await client.db("FoodItems").collection("Food").insertOne(data);
        console.log(result);
    }catch(err){
        console.log(err);
    }
}

export async function insertUser(client , userData){
    try{
        if(userData.isAdmin){
            userData.request = [];
        }
        const result = await client.db("FoodItems").collection("User").insertOne(userData);
        console.log(result);
        return result;
    }catch(err){
        console.log(err);
    }
}

export async function login(client , userData){
    try{
        console.log(userData);
        const result = await client.db("FoodItems").collection("User").findOne({
            emailId : userData.email , 
            password : userData.password
        });
        return result;
    }catch(err){
        console.log(err);
    }
}

export async function updateCart(client , userData){
    try{
        console.log(userData);
        const result = await client.db("FoodItems").collection("User").updateOne({_id:userData.clientId} , {$set:{
            cart : userData.cart
        }});
        console.log(result);
        return result;
    }catch(err){
        console.log(err);
    }
}

export async function addProduct(client , proData){
    try{
        const result = await client.db("FoodItems").collection("Food").insertOne(proData);
        console.log(result);
        return result;
    }catch(err){
        console.log(err);
        return err;
    }
}

export async function sendRequest(client , OrderData){
    try{
        const cursor = await client.db("FoodItems").collection("User").findOne({
            isAdmin : true
        });
        let updatedRequest = cursor.request;
        updatedRequest.push({
            clientId : OrderData.clientId,
            name : OrderData.name,
            address : OrderData.address,
            cart : OrderData.cart
        });
        // console.log(result);
        const result = await client.db("FoodItems").collection("User").updateOne({_id:cursor._id} , {$set:{
            request : updatedRequest
        }});
        return result;
    }catch(err){
        console.log(err);
    }
}

export async function getRequestArr(client){
    try{
        const result = await client.db("FoodItems").collection("User").findOne({isAdmin : true});
        console.log(result);
        return result.request;
    }catch(err){
        console.log(err);
    }
}
