const AdminService = require("../services/admin-service");

module.exports = (app) => {
    
    const service = new AdminService();
    app.use('/app-events',async (req,res,next) => {

        const { payload } = req.body;

        //handle subscribe events
        service.SubscribeEvents(payload);

        console.log("============= Shopping ================");
        console.log(payload);
        res.json(payload);

    });

}
