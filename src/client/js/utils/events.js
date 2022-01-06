import { Subject } from 'rxjs';

export default {
  _subjects: {},

  _getSubject: function (event) {
    if (this._subjects[event]) {
      return this._subjects[event];
    } else {
      this._subjects[event] = new Subject();
      return this._subjects[event];
    }
  },

  listenFor: function (event, cb) {
    return this._getSubject(event).subscribe({
      next: cb,
    });
  },

  emitEvent: function (event, data) {
    this._getSubject(event).next(data);
  },

  unsubscribe: function (sub) {
    sub.unsubscribe();
  },
};
