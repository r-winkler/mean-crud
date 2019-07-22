import statesRepo from '../../../repositories/state.repository';
import util from 'util';

class StateController {

    constructor(router) {
        router.get('/', this.getStates.bind(this));
    }

    getStates(req, res) {
        console.log('*** getStates');

        statesRepo.getStates((err, data) => {
            if (err) {
                console.log('*** getStates error: ' + util.inspect(err));
                res.json({
                    states: null
                });
            } else {
                console.log('*** getStates ok');
                res.json(data);
            }
        });
    }

}

export default StateController;
