import chai from 'chai';
import chaiHttp from 'chai-http';
const expect = chai.expect;
import { model } from 'mongoose';
import app from '../index';

const api = app // Local testing
// const api = 'https://yourdeploy.herokuapp.com'; // Server testing

const Product = model("Product");

const token = process.env.SAMPLE_TOKEN; // A previously generated token to simplify testing
const cod = "SKU1002"; // A sample product code

chai.use(chaiHttp); // Enabling API testing

describe('Product flow', () => {
    beforeEach(async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
    });

    let id: string; // A sample product id to test against
    const n = Date.now(); // Generating a sample product
    const newProduct = {
        "_id": `SKU${n}`,
        "name": `productname-${n}`,
        "stock": Math.floor(Math.random() * 100),
        "price": Math.floor(Math.random() * 100),
        "image": "link",
        "description": "description",
    }

    it('should create a new product', async () => {
        chai.request(api)
            .post('/v1/products')
            .set('content-type', 'application/json')
            .auth(token, { type: 'bearer' })
            .send(JSON.stringify(newProduct))
            .end(async (err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.have.property('_id');
                expect(res.body).to.have.property('createdAt');
                expect(res.body).to.have.property('updatedAt');

                let sampleProduct = await Product.findById(newProduct._id);
                id = `${sampleProduct.id}`
            });
    });

    it('should retrieve all products', async () => {
        chai.request(api)
            .get('/v1/products')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                expect(res.body.length).to.be.greaterThanOrEqual(1);
            });
    });

    it('should retrieve three products', async () => {
        chai.request(api)
            .get('/v1/products?limit=3')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                expect(res.body.length).to.equal(3);
            });
    });

    it('should retrieve specific products', async () => {
        chai.request(api)
            .get('/v1/products/' + cod)
            .set('content-type', 'application/json')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.have.property('_id');
                expect(res.body).to.have.property('name');
                expect(res.body).to.have.property('stock');
                expect(res.body).to.have.property('price');
            });
    });

    it('should edit a specified product', async () => {
        chai.request(api)
            .put('/v1/products/' + cod)
            .set('content-type', 'application/json')
            .auth(token, { type: 'bearer' })
            .send(JSON.stringify({
                name: newProduct.name + " edited"
            }))
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.have.property('_id');
                expect(res.body).to.have.property('name');
                expect(res.body).to.have.property('stock');
                expect(res.body).to.have.property('price');
                expect(res.body.name).to.equal(newProduct.name + " edited");
            });
    });

    it('should delete a specific product', async () => {
        chai.request(api)
            .delete('/v1/products/' + newProduct._id)
            .set('content-type', 'application/json')
            .auth(token, { type: 'bearer' })
            .end(async (err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.have.property('_id');
                expect(res.body).to.have.property('name');
                expect(res.body).to.have.property('stock');
                expect(res.body).to.have.property('price');

                Product.findById(id).then(r => expect(r).to.be.null).catch(console.log);
                // let product = await Product.findById(id);
                // expect(product).to.be.null;
            });
    });
})
