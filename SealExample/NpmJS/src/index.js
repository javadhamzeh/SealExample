window.Seal = async function () {
    alert("Seal");
    const Seal = require('node-seal');
    global.document = {}
    const Morfix = await Seal();

    ////Encryption Parameter
    const schemeType = Morfix.SchemeType.bfv;
    const polyModulusDegree = 4096;
    const bitSizes = [36, 36, 37];
    const bitSize = 20;
    const parms = Morfix.EncryptionParameters(schemeType);
    parms.setPolyModulusDegree(polyModulusDegree)


    const coeffModulus = Morfix.CoeffModulus.Create(
        polyModulusDegree,
        Int32Array.from(bitSizes)
    )
    parms.setCoeffModulus(coeffModulus)
    const plainModulus = Morfix.PlainModulus.Batching(polyModulusDegree, bitSize)
    parms.setPlainModulus(plainModulus)

    const context = Morfix.Context(parms, true)

    if (!context.parametersSet) {
        throw new Error('Could not set the parameters in the given context. Please try different encryption parameters.')
    }
    const keyGenerator = Morfix.KeyGenerator(context)

    const secretKey = keyGenerator.secretKey()
    const publicKey = keyGenerator.createPublicKey()
    const evaluator = Morfix.Evaluator(context)

    const batchEncoder = Morfix.BatchEncoder(context)
    const encryptor = Morfix.Encryptor(context, publicKey)
    const decryptor = Morfix.Decryptor(context, secretKey)

    const array = Int32Array
        .from({ length: 4096 })
        .map((_, i) => i)
    const plain = batchEncoder.encode(array)
    const cipher = encryptor.encrypt(plain)
    const decryptedPlainText = decryptor.decrypt(cipher)
    console.log(cipher)
    const decodedPlainText = batchEncoder.decode(decryptedPlainText)
    console.log(decodedPlainText)
}