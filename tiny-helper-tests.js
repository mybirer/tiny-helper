// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by tiny-helper.js.
import { name as packageName } from "meteor/mybirer:tiny-helper";

// Write your tests here!
// Here is an example.
Tinytest.add('tiny-helper - example', function (test) {
  test.equal(packageName, "tiny-helper");
});
