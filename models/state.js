import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const StateSchema = new Schema({
    id: {type: Number, required: true},
    abbreviation: {type: String, required: true, trim: true},
    name: {type: String, required: true, trim: true}
});

export default mongoose.model('State', StateSchema);