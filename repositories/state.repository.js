import State from '../models/state';

class StateRepository {
    // get all the states
    getStates(callback) {
        console.log('*** StateRepository.getStates');
        State.find({}, {}, {sort: {name: 1}}, (err, states) => {
            if (err) {
                console.log(`*** StateRepository.getStates err: ${err}`);
                return callback(err);
            }
            callback(null, states);
        });
    }

    // get a state
    getState(stateId, callback) {
        console.log('*** StateRepository.getState');
        State.find({'id': stateId}, {}, (err, state) => {
            if (err) {
                console.log(`*** StateRepository.getState err: ${err}`);
                return callback(err);
            }
            callback(null, state);
        });
    }
}

export default new StateRepository();