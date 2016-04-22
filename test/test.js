var original = "";

chai.should();

/* // This work on local without karma
after(function () {
    // When the test either fails or passes, restore the original
    // jQuery ajax function (Sinon.JS also provides tools to help
    // test frameworks automate clean-up like this)
    document.getElementById.restore();
});
*/
describe('CSV', function() {
    /*  // This work on local without karma
    describe('Main', function () {
        it('Modified original?', function () {
          var aux = { innerHTML: "" };
          getElement = sinon.stub(document, "getElementById");
          getElement.withArgs("original").returns({ value: "fda" });
          getElement.withArgs("finaltable").returns(aux);
          main();
          document.getElementById.calledWithMatch("original").should.equal(true);
          document.getElementById.calledWithMatch("finaltable").should.equal(true);
          //aux.innerHTML.should.be.a('[Function]'); // could be a bug in chai?
        });
    });
    */
    describe('CSV Header', function () {
        it('Should accept a simple input', function () {
          original = "1,4,7,a";
          var aux = calculate(original)[0].value;
          aux.should.have.length(4);
          aux[0].should.equal('1');
          aux[1].should.equal('4');
          aux[2].should.equal('7');
          aux[3].should.equal('a');
        });

        it('Should accept a simple input with "" in its values', function () {
          original = '1,4,"7",a';
          var aux = calculate(original)[0].value;
          aux.should.have.length(4);
          aux[0].should.equal('1');
          aux[1].should.equal('4');
          aux[2].should.equal('7');
          aux[3].should.equal('a');
        });

        it("Should accept a simple input with '' in its values", function () {
          original = "1,4,'7','a'";
          var aux = calculate(original)[0].value;
          aux.should.have.length(4);
          aux[0].should.equal('1');
          aux[1].should.equal('4');
          aux[2].should.equal('\'7\'');
          aux[3].should.equal('\'a\'');
        });

        it("Should accept a simple input with \\\" escaped", function () {
          original = "1,4,'\"7','a'";
          var aux = calculate(original)[0].value;
          aux.should.have.length(4);
          aux[0].should.equal('1');
          aux[1].should.equal('4');
          aux[2].should.equal('\'"7\'');
          aux[3].should.equal('\'a\'');
        });

        it("Should accept a simple input with ' no escaped", function () {
          original = "1,4,'7,a";
          var aux = calculate(original)[0].value;
          aux.should.have.length(4);
          aux[0].should.equal('1');
          aux[1].should.equal('4');
          aux[2].should.equal('\'7');
          aux[3].should.equal('a');
        });
    });

    describe('Edge cases', function () {
        it('Empty input', function () {
          original = "";
          var aux = calculate(original);
          aux.should.have.length(0);
        });

        it('Several jump lines', function () {
          original = "\n\n\n";
          var aux = calculate(original);
          aux.should.have.length(0);
        });

        it('Several jump lines + dirty line', function () {
          original = "\n\nfasd\n";
          var aux = calculate(original);
          aux[0].value[0].should.equal('fasd');
        });

        it('Should fail bad input, not follow the format set', function () {
          original = "param1,param2\nbadline\ncorrect, line\n";
          var aux = calculate(original);
          aux[0].value[0].should.equal('param1');
          aux[0].value[1].should.equal('param2');
          aux[1].rowClass.should.equal('error');
          aux[1].value[0].should.equal('badline');
          aux[1].value.should.have.length(1);
          aux[2].value[0].should.equal('correct');
          aux[2].value[1].should.equal('line');
        });
    });
});
