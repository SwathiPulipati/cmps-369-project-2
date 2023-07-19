require('dotenv').config();
const Database = require('dbcmps369');
const bcrypt = require('bcryptjs')

// insert into contact values ('4', 'Swathi', 'Pulipati', '7326478973', 'swathip1007@gmail.com', '21 Champlain Road', 'Monmouth Junction', 'New Jersey', '08852', 'United States', '1', '1', '1');

class ContactDB{
    constructor(){
        this.db = new Database();
    }

    async initialize(){
        await this.db.connect();

        await this.db.schema('Contact', [
            { name: 'id', type: 'INTEGER' },
            { name: 'first_name', type: 'TEXT' },
            { name: 'last_name', type: 'TEXT' },
            { name: 'phone_number', type: 'TEXT' },
            { name: 'email_address', type: 'TEXT' },
            { name: 'street', type: 'TEXT' },
            { name: 'city', type: 'TEXT' },
            { name: 'state', type: 'TEXT' },
            { name: 'zip', type: 'TEXT' },
            { name: 'country', type: 'TEXT' },
            { name: 'contact_by_email', type: 'INTEGER' },
            { name: 'contact_by_phone', type: 'INTEGER' },
            { name: 'contact_by_mail', type: 'INTEGER' }
        ], 'id');

        await this.db.schema('Users', [
            { name: 'id', type: 'INTEGER' },
            { name: 'first_name', type: 'TEXT' },
            { name: 'last_name', type: 'TEXT' },
            { name: 'username', type: 'TEXT' },
            { name: 'password', type: 'TEXT' }
        ], 'id');

    }

    async addDefaultData(){
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync('rcnj', salt); 
        const id = await this.createUser('Scott', 'Frees', 'cmps369', hash);

        const c = {
            first: 'Example',
            last: 'Example',
            phone: '123-456-7890',
            email: 'example@example.com',      
            street: '123 Example Road',        
            city: 'Example',
            state: 'Example',
            zip: '12345',
            country: 'USA',
            by_phone: 'on',
            by_email: 'on'
        }
        for (let i = 0; i < 4; i++) {
            const id = await this.createContact(c);
        }
    }

    async createUser(first, last, username, password) {
        const id = await this.db.create('Users', [
            { column: 'first_name', value: first },
            { column: 'last_name', value: last },
            { column: 'username', value: username },
            { column: 'password', value: password },
        ])
        return id;
    }

    async createContact(r){
        const id = await this.db.create('Contact', [
            { column: 'first_name', value: r.first },
            { column: 'last_name', value: r.last },
            { column: 'phone_number', value: r.phone },
            { column: 'email_address', value: r.email },
            { column: 'street', value: r.street },
            { column: 'city', value: r.city },
            { column: 'state', value: r.state },
            { column: 'zip', value: r.zip },
            { column: 'country', value: r.country },
            { column: 'contact_by_email', value: r.by_email ? 1 : 0 },
            { column: 'contact_by_phone', value: r.by_phone ? 1 : 0 },
            { column: 'contact_by_mail', value: r.by_mail ? 1 : 0 }
        ])
        return id;
    }

    async editContact(id, r){
        await this.db.update('Contact', [
                { column: 'first_name', value: r.first },
                { column: 'last_name', value: r.last },
                { column: 'phone_number', value: r.phone },
                { column: 'email_address', value: r.email },
                { column: 'street', value: r.street },
                { column: 'city', value: r.city },
                { column: 'state', value: r.state },
                { column: 'zip', value: r.zip },
                { column: 'country', value: r.country },
                { column: 'contact_by_email', value: r.by_email ? 1 : 0 },
                { column: 'contact_by_phone', value: r.by_phone ? 1 : 0 },
                { column: 'contact_by_mail', value: r.by_mail ? 1 : 0 }
            ],
            [{column: 'id', value: id}]
        )
        
    }

    async findContacts(){
        const contacts = await this.db.read('Contact', []);
        return contacts;
    }

    async findSingleContact(id){
        const contacts = await this.db.read('Contact', [{column: 'id', value: id}]);
        if (contacts.length > 0) 
            return contacts[0];
        else
            return undefined;
    }

    async findUserByUsername(username){
        const us = await this.db.read('Users', [{ column: 'username', value: username }]);
        if (us.length > 0) 
            return us[0];
        else 
            return undefined;       
    }

    async deleteContact(id){
        await this.db.delete('Contact', [{column: 'id', value: id}])
    }
}

module.exports = ContactDB;