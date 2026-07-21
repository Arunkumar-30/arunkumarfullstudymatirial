const {Op} = require("sequelize");
const { User, Contact, Category, Address } = require("../models/index");


// ✅ Create full data
exports.createContact = async (req, res) => {
    try {
        const { name, email, phone, categoryTitle, city, state } = req.body;

        const user = await User.create({ name, email });

        const category = await Category.create({ title: categoryTitle });

        const contact = await Contact.create({
            phone,
            userId: user.id,
            categoryId: category.id,
        });

        await Address.create({
            city,
            state,
            contactId: contact.id,
        });

        res.json({ message: "Created Successfully" });
    } catch (error) {
        res.status(500).json(error);
    }
};

// ✅ Fetch with JOIN
exports.getContacts = async (req, res) => {
    try {
        const data = await Contact.findAll({
            include: [
                { model: User, attributes: ["name", "email"] },
                { model: Category, attributes: ["title"] },
                { model: Address, attributes: ["city", "state"] },
            ],
        });

        res.json({ "message": "successfully data feched", data });
    } catch (error) {
        res.status(500).json({ "message": "failed to fetch data", error });
    }
};

exports.bulkCreateContacts = async (req, res) => {
    try {
        const data = req.body;

        for (let item of data) {
            const user = await User.create({
                name: item.name,
                email: item.email,
            });

            const category = await Category.create({
                title: item.categoryTitle,
            });

            const contact = await Contact.create({
                phone: item.phone,
                userId: user.id,
                categoryId: category.id,
            });

            await Address.create({
                city: item.city,
                state: item.state,
                contactId: contact.id,
            });
        }

        res.json({ message: "Bulk Insert Success" });
    } catch (error) {
        res.status(500).json(error);
    }
};

exports.getUsersByTime = async (req, res) => {
    try {
        // const now = new Date();

        // Today 8 am
    //     const today8am = new Date();
    //    today8am.setHours(17, 21, 0, 0);
     

        // Yesterday 8 am
        // const yesterday8am = new Date(today8am);
        // yesterday8am.setDate(today8am.getDate() - 1)

        const users = await User.findAll({
            // where: {
            //     createdAt: {
            //         [Op.between]: [yesterday8am, today8am],
            //     }
            // }
            // where:{
            //     name:"arun"
            // }

             where:{
                name:{[Op.like] : "%ar%"},
                email:{[Op.like]:"%ar%"}
             }
        })

        res.json({ "message": "successfully data feched", users });
    } catch (error) {
        res.status(500).json({ "message": "failed to fetch data", error });
    }
}