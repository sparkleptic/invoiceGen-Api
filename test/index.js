var request = require("request")
var fetch = require('node-fetch');
var pdf = require('../')
var path = require('path')
var BUCKET_NAME = 'upwork-rajesh-invoice-generator'; 
var aws = require('aws-sdk');
var fs = require('fs')
var url = require('url');
var querystring = require('querystring'); 
var asyncLoop = require('node-async-loop');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var router = express.Router();

// Move PDF to AWS s3 server.
aws.config.loadFromPath('./AwsConfig.json');
var s3 = new aws.S3();
function uploadpdf(pdfname) {
  var full_file_path = 'invoicePDF/'+pdfname;
  uploadFile(full_file_path, './'+full_file_path);
}
function uploadFile(remoteFilename, fileName) {
  var fileBuffer = fs.readFileSync(fileName);
  var status =  s3.putObject({
    ACL: 'public-read',
    Bucket: BUCKET_NAME,
    Key: remoteFilename,
    Body: fileBuffer,
    ContentType: 'application/pdf'
  }, function(error, response) {
    // console.log('uploaded file[' + fileName + '] to [' + remoteFilename + '] as [' + metaData + ']');
    // console.log(arguments);
    if(status){
        console.log("Uploaded successfully - "+fileName);
    }else{
      console.log("Something went wrong with -"+fileName);
    }
  });
}

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
var port = process.env.PORT || 4200; // set our port

router.use(function(req, res, next) {
  // do logging
  // console.log('Something is happening.');
  next();
});

router.get('/', function(req, res) {
  
  var invoicenumber = req.query.invoicenumber;
  var url = "http://localhost:3000/api/invoice_pk_invoicenumber/"+invoicenumber

  request({
      url: url,
      json: true
  }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
          // console.log(body[0].Vertragsnummer)
          if (body && body != '') {
            if (body[0].Queue == null || body[0].Queue == '') {

                var template = path.join(__dirname, 'invoicerec.html')

                // Create PDF Name and convert and get in variable
                var filename = "Rechnungsdatensatz_"+invoicenumber+".pdf"
                var templateHtml = fs.readFileSync(template, 'utf8')

                // Get Images from path
                var energicos = path.join('file://', __dirname, 'energicos-logo.png')
                var stripe = path.join('file://', __dirname, 'stripe.png')  
                var vertragsnummericon = path.join('file://', __dirname, 'vertragsnummer-icon.png')
                var objektnummericon = path.join('file://', __dirname, 'objektnummer-icon.png')
                var rechungsnummericon = path.join('file://', __dirname, 'rechungsnummer-icon.png')
                var abrechungszeitraumicon = path.join('file://', __dirname, 'abrechungszeitraum-icon.png')
                var zehibetragbruttoicon = path.join('file://', __dirname, 'zehibetrag_brutto-icon.png')

                var graphickey = path.join('file://', __dirname, 'graphic-key.png')
                var piechart = path.join('file://', __dirname, 'pie-chart.svg')

                var datumicon = path.join('file://', __dirname, 'datum-icon.png')
                var ansprechpartnericon = path.join('file://', __dirname, 'ansprechpartner-icon.png')
                var telefonicon = path.join('file://', __dirname, 'telefon-icon.png')

                // Assign value to images parameter.
                templateHtml = templateHtml.replace('{{energicos}}', energicos)
                templateHtml = templateHtml.replace('{{energicos2}}', energicos)
                templateHtml = templateHtml.replace('{{energicos3}}', energicos)
                templateHtml = templateHtml.replace('{{energicos4}}', energicos)
                templateHtml = templateHtml.replace('{{stripe}}', stripe)
                templateHtml = templateHtml.replace('{{stripe}}', stripe)
                templateHtml = templateHtml.replace('{{stripe2}}', stripe)
                templateHtml = templateHtml.replace('{{stripe3}}', stripe)
                templateHtml = templateHtml.replace('{{stripe4}}', stripe)
                templateHtml = templateHtml.replace('{{vertragsnummericon}}', vertragsnummericon)
                templateHtml = templateHtml.replace('{{objektnummericon}}', objektnummericon)
                templateHtml = templateHtml.replace('{{rechungsnummericon}}', rechungsnummericon)
                templateHtml = templateHtml.replace('{{abrechungszeitraumicon}}', abrechungszeitraumicon)
                templateHtml = templateHtml.replace('{{zehibetragbruttoicon}}', zehibetragbruttoicon)

                templateHtml = templateHtml.replace('{{graphickey}}', graphickey) 
                templateHtml = templateHtml.replace('{{piechart}}', piechart)

                templateHtml = templateHtml.replace('{{datumicon}}', datumicon)
                templateHtml = templateHtml.replace('{{datumicon2}}', datumicon)
                templateHtml = templateHtml.replace('{{datumicon3}}', datumicon)
                templateHtml = templateHtml.replace('{{datumicon4}}', datumicon)
                templateHtml = templateHtml.replace('{{ansprechpartnericon}}', ansprechpartnericon)
                templateHtml = templateHtml.replace('{{ansprechpartnericon2}}', ansprechpartnericon)
                templateHtml = templateHtml.replace('{{ansprechpartnericon3}}', ansprechpartnericon)
                templateHtml = templateHtml.replace('{{ansprechpartnericon4}}', ansprechpartnericon)
                templateHtml = templateHtml.replace('{{telefonicon}}', telefonicon)
                templateHtml = templateHtml.replace('{{telefonicon2}}', telefonicon)
                templateHtml = templateHtml.replace('{{telefonicon3}}', telefonicon)
                templateHtml = templateHtml.replace('{{telefonicon4}}', telefonicon)

                // Assign HTML data to the keys
                templateHtml = templateHtml.replace('{{Kundenname}}', body[0].Kundenname)
                templateHtml = templateHtml.replace('{{Kundenname2}}', body[0].Kundenname)
                templateHtml = templateHtml.replace('{{Kundenname3}}', body[0].Kundenname)
                templateHtml = templateHtml.replace('{{Kundenname4}}', body[0].Kundenname)

                templateHtml = templateHtml.replace('{{KD_Strasse}}', body[0].KD_Strasse)
                templateHtml = templateHtml.replace('{{KD_Strasse2}}', body[0].KD_Strasse)
                templateHtml = templateHtml.replace('{{KD_Strasse3}}', body[0].KD_Strasse)
                templateHtml = templateHtml.replace('{{KD_Strasse4}}', body[0].KD_Strasse)

                templateHtml = templateHtml.replace('{{Rechnungsdatensatz}}', body[0].Rechnungsdatensatz)

                templateHtml = templateHtml.replace('{{Vertragsnummer}}', body[0].Vertragsnummer)
                templateHtml = templateHtml.replace('{{Vertragsnummer2}}', body[0].Vertragsnummer)
                templateHtml = templateHtml.replace('{{Vertragsnummer3}}', body[0].Vertragsnummer)
                templateHtml = templateHtml.replace('{{Vertragsnummer4}}', body[0].Vertragsnummer)

                templateHtml = templateHtml.replace('{{Rechnungsnummer}}', body[0].Rechnungsnummer)
                templateHtml = templateHtml.replace('{{Rechnungsnummer2}}', body[0].Rechnungsnummer)
                templateHtml = templateHtml.replace('{{Rechnungsnummer3}}', body[0].Rechnungsnummer)
                templateHtml = templateHtml.replace('{{Rechnungsnummer4}}', body[0].Rechnungsnummer)

                templateHtml = templateHtml.replace('{{Rechnung_von}}', body[0].Rechnung_von)
                templateHtml = templateHtml.replace('{{Rechnung_bis}}', body[0].Rechnung_bis)

                templateHtml = templateHtml.replace('{{Rechnungsdatum}}', body[0].Rechnungsdatum)
                templateHtml = templateHtml.replace('{{Rechnungsdatum2}}', body[0].Rechnungsdatum)
                templateHtml = templateHtml.replace('{{Rechnungsdatum3}}', body[0].Rechnungsdatum)
                templateHtml = templateHtml.replace('{{Rechnungsdatum4}}', body[0].Rechnungsdatum)

                templateHtml = templateHtml.replace('{{Zahlungsziel}}', body[0].Zahlungsziel)
                templateHtml = templateHtml.replace('{{Debitorennummer}}', body[0].Debitorennummer)

                templateHtml = templateHtml.replace('{{KD_PLZ_Ort}}', body[0].KD_PLZ_Ort)
                templateHtml = templateHtml.replace('{{KD_PLZ_Ort2}}', body[0].KD_PLZ_Ort)
                templateHtml = templateHtml.replace('{{KD_PLZ_Ort3}}', body[0].KD_PLZ_Ort)
                templateHtml = templateHtml.replace('{{KD_PLZ_Ort4}}', body[0].KD_PLZ_Ort)

                templateHtml = templateHtml.replace('{{KD_E_Mail}}', body[0].KD_E_Mail)
                templateHtml = templateHtml.replace('{{KD_E_Mail2}}', body[0].KD_E_Mail)
                templateHtml = templateHtml.replace('{{KD_E_Mail3}}', body[0].KD_E_Mail)

                templateHtml = templateHtml.replace('{{Ansprechpartner}}', body[0].Ansprechpartner)
                templateHtml = templateHtml.replace('{{Ansprechpartner2}}', body[0].Ansprechpartner)
                templateHtml = templateHtml.replace('{{Ansprechpartner3}}', body[0].Ansprechpartner)
                templateHtml = templateHtml.replace('{{Ansprechpartner4}}', body[0].Ansprechpartner)

                templateHtml = templateHtml.replace('{{SEPA_Lastschriftmandat}}', body[0].SEPA_Lastschriftmandat)
                templateHtml = templateHtml.replace('{{IBAN}}', body[0].IBAN)
                templateHtml = templateHtml.replace('{{BIC}}', body[0].BIC)
                templateHtml = templateHtml.replace('{{c_o}}', body[0].c_o)
                templateHtml = templateHtml.replace('{{RE_Name}}', body[0].RE_Name)
                templateHtml = templateHtml.replace('{{RE_Strasse}}', body[0].RE_Strasse)
                templateHtml = templateHtml.replace('{{RE_PLZ_Ort}}', body[0].RE_PLZ_Ort)
                
                templateHtml = templateHtml.replace('{{Objektnummer}}', body[0].Objektnummer)
                templateHtml = templateHtml.replace('{{Objektnummer2}}', body[0].Objektnummer)
                templateHtml = templateHtml.replace('{{Objektnummer3}}', body[0].Objektnummer)
                templateHtml = templateHtml.replace('{{Objektnummer4}}', body[0].Objektnummer)

                templateHtml = templateHtml.replace('{{Lieferadresse}}', body[0].Lieferadresse)
                templateHtml = templateHtml.replace('{{Lieferadresse2}}', body[0].Lieferadresse)
                templateHtml = templateHtml.replace('{{Lieferadresse3}}', body[0].Lieferadresse)

                templateHtml = templateHtml.replace('{{PLZ_Liegenschaft}}', body[0].PLZ_Liegenschaft)
                templateHtml = templateHtml.replace('{{Messbereich_MB1}}', body[0].Messbereich_MB1)
                templateHtml = templateHtml.replace('{{Zählernummer_MB1_p1}}', body[0].Zählernummer_MB1_p1)
                templateHtml = templateHtml.replace('{{Zeitraum_von_MB1_p1}}', body[0].Zeitraum_von_MB1_p1)
                templateHtml = templateHtml.replace('{{Zeitraum_bis_MB1_p1}}', body[0].Zeitraum_bis_MB1_p1)
                templateHtml = templateHtml.replace('{{Zählerstand_von_MB1_p1}}', body[0].Zählerstand_von_MB1_p1)
                templateHtml = templateHtml.replace('{{Zählerstand_bis_MB1_p1}}', body[0].Zählerstand_bis_MB1_p1)
                templateHtml = templateHtml.replace('{{Verbrauch_in_Verbrauchseinheit_MB1_p1}}', body[0].Verbrauch_in_Verbrauchseinheit_MB1_p1)
                templateHtml = templateHtml.replace('{{Umrechnungsfaktor_MB1_p1}}', body[0].Umrechnungsfaktor_MB1_p1)
                templateHtml = templateHtml.replace('{{Verbrauch_in_MWh_MB1_p1}}', body[0].Verbrauch_in_MWh_MB1_p1)
                templateHtml = templateHtml.replace('{{Zählernummer_MB1_p2}}', body[0].Zählernummer_MB1_p2)
                templateHtml = templateHtml.replace('{{Zeitraum_von_MB1_p2}}', body[0].Zeitraum_von_MB1_p2)
                templateHtml = templateHtml.replace('{{Zeitraum_bis_MB1_p2}}', body[0].Zeitraum_bis_MB1_p2)
                templateHtml = templateHtml.replace('{{Zählerstand_von_MB1_p2}}', body[0].Zählerstand_von_MB1_p2)
                templateHtml = templateHtml.replace('{{Zählerstand_bis_MB1_p2}}', body[0].Zählerstand_bis_MB1_p2)
                templateHtml = templateHtml.replace('{{Verbrauch_in_Verbrauchseinheit_MB1_p2}}', body[0].Verbrauch_in_Verbrauchseinheit_MB1_p2)
                templateHtml = templateHtml.replace('{{Umrechnungsfaktor_MB1_p2}}', body[0].Umrechnungsfaktor_MB1_p2)
                templateHtml = templateHtml.replace('{{Verbrauch_in_MWh_MB1_p2}}', body[0].Verbrauch_in_MWh_MB1_p2)
                templateHtml = templateHtml.replace('{{Zählernummer_MB1_p3}}', body[0].Zählernummer_MB1_p3)
                templateHtml = templateHtml.replace('{{Zeitraum_von_MB1_p3}}', body[0].Zeitraum_von_MB1_p3)
                templateHtml = templateHtml.replace('{{Zeitraum_bis_MB1_p3}}', body[0].Zeitraum_bis_MB1_p3)
                templateHtml = templateHtml.replace('{{Zählerstand_von_MB1_p3}}', body[0].Zählerstand_von_MB1_p3)
                templateHtml = templateHtml.replace('{{Zählerstand_bis_MB1_p3}}', body[0].Zählerstand_bis_MB1_p3)
                templateHtml = templateHtml.replace('{{Verbrauch_in_Verbrauchseinheit_MB1_p3}}', body[0].Verbrauch_in_Verbrauchseinheit_MB1_p3)
                templateHtml = templateHtml.replace('{{Umrechnungsfaktor_MB1_p3}}', body[0].Umrechnungsfaktor_MB1_p3)
                templateHtml = templateHtml.replace('{{Verbrauch_in_MWh_MB1_p3}}', body[0].Verbrauch_in_MWh_MB1_p3)
                templateHtml = templateHtml.replace('{{Zählernummer_MB1_p4}}', body[0].Zählernummer_MB1_p4)
                templateHtml = templateHtml.replace('{{Zeitraum_von_MB1_p4}}', body[0].Zeitraum_von_MB1_p4)
                templateHtml = templateHtml.replace('{{Zeitraum_bis_MB1_p4}}', body[0].Zeitraum_bis_MB1_p4)
                templateHtml = templateHtml.replace('{{Zählerstand_von_MB1_p4}}', body[0].Zählerstand_von_MB1_p4)
                templateHtml = templateHtml.replace('{{Zählerstand_bis_MB1_p4}}', body[0].Zählerstand_bis_MB1_p4)
                templateHtml = templateHtml.replace('{{Verbrauch_in_Verbrauchseinheit_MB1_p4}}', body[0].Verbrauch_in_Verbrauchseinheit_MB1_p4)
                templateHtml = templateHtml.replace('{{Umrechnungsfaktor_MB1_p4}}', body[0].Umrechnungsfaktor_MB1_p4)
                templateHtml = templateHtml.replace('{{Verbrauch_in_MWh_MB1_p4}}', body[0].Verbrauch_in_MWh_MB1_p4)
                templateHtml = templateHtml.replace('{{Zählernummer_MB1_p5}}', body[0].Zählernummer_MB1_p5)
                templateHtml = templateHtml.replace('{{Zeitraum_von_MB1_p5}}', body[0].Zeitraum_von_MB1_p5)
                templateHtml = templateHtml.replace('{{Zeitraum_bis_MB1_p5}}', body[0].Zeitraum_bis_MB1_p5)
                templateHtml = templateHtml.replace('{{Zählerstand_von_MB1_p5}}', body[0].Zählerstand_von_MB1_p5)
                templateHtml = templateHtml.replace('{{Zählerstand_bis_MB1_p5}}', body[0].Zählerstand_bis_MB1_p5)
                templateHtml = templateHtml.replace('{{Verbrauch_in_Verbrauchseinheit_MB1_p5}}', body[0].Verbrauch_in_Verbrauchseinheit_MB1_p5)
                templateHtml = templateHtml.replace('{{Umrechnungsfaktor_MB1_p5}}', body[0].Umrechnungsfaktor_MB1_p5)
                templateHtml = templateHtml.replace('{{Verbrauch_in_MWh_MB1_p5}}', body[0].Verbrauch_in_MWh_MB1_p5)
                templateHtml = templateHtml.replace('{{Verbrauchseinheit_MB1}}', body[0].Verbrauchseinheit_MB1)
                templateHtml = templateHtml.replace('{{Total_Verbrauch_in_Verbrauchseinheit_MB1}}', body[0].Total_Verbrauch_in_Verbrauchseinheit_MB1)
                templateHtml = templateHtml.replace('{{Total_Verbrauch_in_MWh_MB1}}', body[0].Total_Verbrauch_in_MWh_MB1)
                templateHtml = templateHtml.replace('{{Zeitraum_von_MB1_ap1}}', body[0].Zeitraum_von_MB1_ap1)
                templateHtml = templateHtml.replace('{{Zeitraum_bis_MB1_ap1}}', body[0].Zeitraum_bis_MB1_ap1)
                templateHtml = templateHtml.replace('{{Verbrauch_in_MWh_MB1_ap1}}', body[0].Verbrauch_in_MWh_MB1_ap1)
                templateHtml = templateHtml.replace('{{Verbrauchspreis_MB1_ap1}}', body[0].Verbrauchspreis_MB1_ap1)
                templateHtml = templateHtml.replace('{{Änderungsfaktor_MB1_ap1}}', body[0].Änderungsfaktor_MB1_ap1)
                templateHtml = templateHtml.replace('{{Verbrauchskosten_MB1_ap1}}', body[0].Verbrauchskosten_MB1_ap1)
                templateHtml = templateHtml.replace('{{Zeitraum_von_MB1_ap2}}', body[0].Zeitraum_von_MB1_ap2)
                templateHtml = templateHtml.replace('{{Zeitraum_bis_MB1_ap2}}', body[0].Zeitraum_bis_MB1_ap2)
                templateHtml = templateHtml.replace('{{Verbrauch_in_MWh_MB1_ap2}}', body[0].Verbrauch_in_MWh_MB1_ap2)
                templateHtml = templateHtml.replace('{{Verbrauchspreis_MB1_ap2}}', body[0].Verbrauchspreis_MB1_ap2)
                templateHtml = templateHtml.replace('{{Änderungsfaktor_MB1_ap2}}', body[0].Änderungsfaktor_MB1_ap2)
                templateHtml = templateHtml.replace('{{Verbrauchskosten_MB1_ap2}}', body[0].Verbrauchskosten_MB1_ap2)
                templateHtml = templateHtml.replace('{{Zeitraum_von_MB1_ap3}}', body[0].Zeitraum_von_MB1_ap3)
                templateHtml = templateHtml.replace('{{Zeitraum_bis_MB1_ap3}}', body[0].Zeitraum_bis_MB1_ap3)
                templateHtml = templateHtml.replace('{{Verbrauch_in_MWh_MB1_ap3}}', body[0].Verbrauch_in_MWh_MB1_ap3)
                templateHtml = templateHtml.replace('{{Verbrauchspreis_MB1_ap3}}', body[0].Verbrauchspreis_MB1_ap3)
                templateHtml = templateHtml.replace('{{Änderungsfaktor_MB1_ap3}}', body[0].Änderungsfaktor_MB1_ap3)
                templateHtml = templateHtml.replace('{{Verbrauchskosten_MB1_ap3}}', body[0].Verbrauchskosten_MB1_ap3)
                templateHtml = templateHtml.replace('{{Zeitraum_von_MB1_ap4}}', body[0].Zeitraum_von_MB1_ap4)
                templateHtml = templateHtml.replace('{{Zeitraum_bis_MB1_ap4}}', body[0].Zeitraum_bis_MB1_ap4)
                templateHtml = templateHtml.replace('{{Verbrauch_in_MWh_MB1_ap4}}', body[0].Verbrauch_in_MWh_MB1_ap4)
                templateHtml = templateHtml.replace('{{Verbrauchspreis_MB1_ap4}}', body[0].Verbrauchspreis_MB1_ap4)
                templateHtml = templateHtml.replace('{{Änderungsfaktor_MB1_ap4}}', body[0].Änderungsfaktor_MB1_ap4)
                templateHtml = templateHtml.replace('{{Verbrauchskosten_MB1_ap4}}', body[0].Verbrauchskosten_MB1_ap4)
                templateHtml = templateHtml.replace('{{Total_Verbrauchspreis_MB1}}', body[0].Total_Verbrauchspreis_MB1)
                templateHtml = templateHtml.replace('{{Total_Verbrauchskosten_MB1}}', body[0].Total_Verbrauchskosten_MB1)
                templateHtml = templateHtml.replace('{{Zeitraum_von_MB1_gp1}}', body[0].Zeitraum_von_MB1_gp1)
                templateHtml = templateHtml.replace('{{Zeitraum_bis_MB1_gp1}}', body[0].Zeitraum_bis_MB1_gp1)
                templateHtml = templateHtml.replace('{{Leistung_MB1_gp1}}', body[0].Leistung_MB1_gp1)
                templateHtml = templateHtml.replace('{{Grundpreis_MB1_gp1}}', body[0].Grundpreis_MB1_gp1)
                templateHtml = templateHtml.replace('{{Änderungsfaktor_MB1_gp1}}', body[0].Änderungsfaktor_MB1_gp1)
                templateHtml = templateHtml.replace('{{Grundkosten_MB1_gp1}}', body[0].Grundkosten_MB1_gp1)
                templateHtml = templateHtml.replace('{{Zeitraum_von_MB1_gp2}}', body[0].Zeitraum_von_MB1_gp2)
                templateHtml = templateHtml.replace('{{Zeitraum_bis_MB1_gp2}}', body[0].Zeitraum_bis_MB1_gp2)
                templateHtml = templateHtml.replace('{{Leistung_MB1_gp2}}', body[0].Leistung_MB1_gp2)
                templateHtml = templateHtml.replace('{{Grundpreis_MB1_gp2}}', body[0].Grundpreis_MB1_gp2)
                templateHtml = templateHtml.replace('{{Änderungsfaktor_MB1_gp2}}', body[0].Änderungsfaktor_MB1_gp2)
                templateHtml = templateHtml.replace('{{Grundkosten_MB1_gp2}}', body[0].Grundkosten_MB1_gp2)
                templateHtml = templateHtml.replace('{{Zeitraum_von_MB1_gp3}}', body[0].Zeitraum_von_MB1_gp3)
                templateHtml = templateHtml.replace('{{Zeitraum_bis_MB1_gp3}}', body[0].Zeitraum_bis_MB1_gp3)
                templateHtml = templateHtml.replace('{{Leistung_MB1_gp3}}', body[0].Leistung_MB1_gp3)
                templateHtml = templateHtml.replace('{{Grundpreis_MB1_gp3}}', body[0].Grundpreis_MB1_gp3)
                templateHtml = templateHtml.replace('{{Änderungsfaktor_MB1_gp3}}', body[0].Änderungsfaktor_MB1_gp3)
                templateHtml = templateHtml.replace('{{Grundkosten_MB1_gp3}}', body[0].Grundkosten_MB1_gp3)
                templateHtml = templateHtml.replace('{{Zeitraum_von_MB1_gp4}}', body[0].Zeitraum_von_MB1_gp4)
                templateHtml = templateHtml.replace('{{Zeitraum_bis_MB1_gp4}}', body[0].Zeitraum_bis_MB1_gp4)
                templateHtml = templateHtml.replace('{{Leistung_MB1_gp4}}', body[0].Leistung_MB1_gp4)
                templateHtml = templateHtml.replace('{{Grundpreis_MB1_gp4}}', body[0].Grundpreis_MB1_gp4)
                templateHtml = templateHtml.replace('{{Änderungsfaktor_MB1_gp4}}', body[0].Änderungsfaktor_MB1_gp4)
                templateHtml = templateHtml.replace('{{Grundkosten_MB1_gp4}}', body[0].Grundkosten_MB1_gp4)
                templateHtml = templateHtml.replace('{{Leistungseinheit_MB1}}', body[0].Leistungseinheit_MB1)
                templateHtml = templateHtml.replace('{{Grundpreiseinheit_MB1}}', body[0].Grundpreiseinheit_MB1)
                templateHtml = templateHtml.replace('{{Total_Grundpreis_MB1}}', body[0].Total_Grundpreis_MB1)
                templateHtml = templateHtml.replace('{{Total_Grundkosten_MB1}}', body[0].Total_Grundkosten_MB1)
                templateHtml = templateHtml.replace('{{Productelement_PE2}}', body[0].Productelement_PE2)
                templateHtml = templateHtml.replace('{{Zählernummer_PE2_p1}}', body[0].Zählernummer_PE2_p1)
                templateHtml = templateHtml.replace('{{Zeitraum_von_PE2_p1}}', body[0].Zeitraum_von_PE2_p1)
                templateHtml = templateHtml.replace('{{Zeitraum_bis_PE2_p1}}', body[0].Zeitraum_bis_PE2_p1)
                templateHtml = templateHtml.replace('{{Zählerstand_von_PE2_p1}}', body[0].Zählerstand_von_PE2_p1)
                templateHtml = templateHtml.replace('{{Zählerstand_bis_PE2_p1}}', body[0].Zählerstand_bis_PE2_p1)
                templateHtml = templateHtml.replace('{{Verbrauch_in_Verbrauchseinheit_PE2_p1}}', body[0].Verbrauch_in_Verbrauchseinheit_PE2_p1)
                templateHtml = templateHtml.replace('{{Umrachnungsfaktor_PE2_p1}}', body[0].Umrachnungsfaktor_PE2_p1)
                templateHtml = templateHtml.replace('{{Verbrauch_in_MWh_PE2_p1}}', body[0].Verbrauch_in_MWh_PE2_p1)
                templateHtml = templateHtml.replace('{{Zählernummer_PE2_p2}}', body[0].Zählernummer_PE2_p2)
                templateHtml = templateHtml.replace('{{Zeitraum_von_PE2_p2}}', body[0].Zeitraum_von_PE2_p2)
                templateHtml = templateHtml.replace('{{Zeitraum_bis_PE2_p2}}', body[0].Zeitraum_bis_PE2_p2)
                templateHtml = templateHtml.replace('{{Zählerstand_von_PE2_p2}}', body[0].Zählerstand_von_PE2_p2)
                templateHtml = templateHtml.replace('{{Zählerstand_bis_PE2_p2}}', body[0].Zählerstand_bis_PE2_p2)
                templateHtml = templateHtml.replace('{{Verbrauch_in_Verbrauchseinheit_von_PE2_p2}}', body[0].Verbrauch_in_Verbrauchseinheit_von_PE2_p2)
                templateHtml = templateHtml.replace('{{Umrechnungsfaktor_PE2_p2}}', body[0].Umrechnungsfaktor_PE2_p2)
                templateHtml = templateHtml.replace('{{Verbrauch_in_MWh_PE2_p2}}', body[0].Verbrauch_in_MWh_PE2_p2)
                templateHtml = templateHtml.replace('{{Zählernummer_PE2_p3}}', body[0].Zählernummer_PE2_p3)
                templateHtml = templateHtml.replace('{{Zeitraum_von_PE2_p3}}', body[0].Zeitraum_von_PE2_p3)
                templateHtml = templateHtml.replace('{{Zeitraum_bis_PE2_p3}}', body[0].Zeitraum_bis_PE2_p3)
                templateHtml = templateHtml.replace('{{Zählerstand_von_PE2_p3}}', body[0].Zählerstand_von_PE2_p3)
                templateHtml = templateHtml.replace('{{Zählerstand_bis_PE2_p3}}', body[0].Zählerstand_bis_PE2_p3)
                templateHtml = templateHtml.replace('{{Verbrauch_in_Verbrauchseinheit_PE2_p3}}', body[0].Verbrauch_in_Verbrauchseinheit_PE2_p3)
                templateHtml = templateHtml.replace('{{Umrechnungsfaktor_PE2_p3}}', body[0].Umrechnungsfaktor_PE2_p3)
                templateHtml = templateHtml.replace('{{Verbrauch_in_MWh_PE2_p3}}', body[0].Verbrauch_in_MWh_PE2_p3)
                templateHtml = templateHtml.replace('{{Zählernummer_PE2_p4}}', body[0].Zählernummer_PE2_p4)
                templateHtml = templateHtml.replace('{{Zeitraum_von_PE2_p4}}', body[0].Zeitraum_von_PE2_p4)
                templateHtml = templateHtml.replace('{{Zeitraum_bis_PE2_p4}}', body[0].Zeitraum_bis_PE2_p4)
                templateHtml = templateHtml.replace('{{Zählerstand_von_PE2_p4}}', body[0].Zählerstand_von_PE2_p4)
                templateHtml = templateHtml.replace('{{Zählerstand_bis_PE2_p4}}', body[0].Zählerstand_bis_PE2_p4)
                templateHtml = templateHtml.replace('{{Verbrauch_in_Verbrauchseinheit_PE2_p4}}', body[0].Verbrauch_in_Verbrauchseinheit_PE2_p4)
                templateHtml = templateHtml.replace('{{Umrechnungsfaktor_PE2_p4}}', body[0].Umrechnungsfaktor_PE2_p4)
                templateHtml = templateHtml.replace('{{Verbrauch_in_MWh_PE2_p4}}', body[0].Verbrauch_in_MWh_PE2_p4)
                templateHtml = templateHtml.replace('{{Zählernummer_PE2_p5}}', body[0].Zählernummer_PE2_p5)
                templateHtml = templateHtml.replace('{{Zeitraum_von_PE2_p5}}', body[0].Zeitraum_von_PE2_p5)
                templateHtml = templateHtml.replace('{{Zeitraum_bis_PE2_p5}}', body[0].Zeitraum_bis_PE2_p5)
                templateHtml = templateHtml.replace('{{Zählerstand_von_PE2_p5}}', body[0].Zählerstand_von_PE2_p5)
                templateHtml = templateHtml.replace('{{Zählerstand_bis_PE2_p5}}', body[0].Zählerstand_bis_PE2_p5)
                templateHtml = templateHtml.replace('{{Verbrauch_in_Verbrauchseinheit_PE2_p5}}', body[0].Verbrauch_in_Verbrauchseinheit_PE2_p5)
                templateHtml = templateHtml.replace('{{Umrechnungsfaktor_PE2_p5}}', body[0].Umrechnungsfaktor_PE2_p5)
                templateHtml = templateHtml.replace('{{Verbrauch_in_MWh_PE2_p5}}', body[0].Verbrauch_in_MWh_PE2_p5)
                templateHtml = templateHtml.replace('{{Verbrauchseinheit_PE2}}', body[0].Verbrauchseinheit_PE2)
                templateHtml = templateHtml.replace('{{Total_Verbrauch_in_Verbrauchseinheit_PE2}}', body[0].Total_Verbrauch_in_Verbrauchseinheit_PE2)
                templateHtml = templateHtml.replace('{{Total_consumption_in_MWh_PE2}}', body[0].Total_consumption_in_MWh_PE2)
                templateHtml = templateHtml.replace('{{Zeitraum_von_PE2_ap1}}', body[0].Zeitraum_von_PE2_ap1)
                templateHtml = templateHtml.replace('{{Zeitraum_bis_PE2_ap1}}', body[0].Zeitraum_bis_PE2_ap1)
                templateHtml = templateHtml.replace('{{Verbrauch_in_MWh_PE2_ap1}}', body[0].Verbrauch_in_MWh_PE2_ap1)
                templateHtml = templateHtml.replace('{{consumptionprice_PE2_ap1}}', body[0].consumptionprice_PE2_ap1)
                templateHtml = templateHtml.replace('{{pricechangefactor_PE2_ap1}}', body[0].pricechangefactor_PE2_ap1)
                templateHtml = templateHtml.replace('{{consumptioncosts_PE2_ap1}}', body[0].consumptioncosts_PE2_ap1)
                templateHtml = templateHtml.replace('{{Zeitraum_von_PE2_ap2}}', body[0].Zeitraum_von_PE2_ap2)
                templateHtml = templateHtml.replace('{{Zeitraum_bis_PE2_ap2}}', body[0].Zeitraum_bis_PE2_ap2)
                templateHtml = templateHtml.replace('{{Verbrauch_in_MWh_PE2_ap2}}', body[0].Verbrauch_in_MWh_PE2_ap2)
                templateHtml = templateHtml.replace('{{consumptionprice_PE2_ap2}}', body[0].consumptionprice_PE2_ap2)
                templateHtml = templateHtml.replace('{{pricechangefactor_PE2_ap2}}', body[0].pricechangefactor_PE2_ap2)
                templateHtml = templateHtml.replace('{{consumptioncosts_PE2_ap2}}', body[0].consumptioncosts_PE2_ap2)
                templateHtml = templateHtml.replace('{{Zeitraum_von_PE2_ap3}}', body[0].Zeitraum_von_PE2_ap3)
                templateHtml = templateHtml.replace('{{billing_to_PE2_ap3}}', body[0].billing_to_PE2_ap3)
                templateHtml = templateHtml.replace('{{Verbrauch_in_MWh_PE2_ap3}}', body[0].Verbrauch_in_MWh_PE2_ap3)
                templateHtml = templateHtml.replace('{{consumptionprice_PE2_ap3}}', body[0].consumptionprice_PE2_ap3)
                templateHtml = templateHtml.replace('{{pricechangefactor_PE2_ap3}}', body[0].pricechangefactor_PE2_ap3)
                templateHtml = templateHtml.replace('{{consumptioncosts_PE2_ap3}}', body[0].consumptioncosts_PE2_ap3)
                templateHtml = templateHtml.replace('{{Zeitraum_von_PE2_ap4}}', body[0].Zeitraum_von_PE2_ap4)
                templateHtml = templateHtml.replace('{{Zeitraum_bis_PE2_ap4}}', body[0].Zeitraum_bis_PE2_ap4)
                templateHtml = templateHtml.replace('{{Verbrauch_in_MWh_PE2_ap4}}', body[0].Verbrauch_in_MWh_PE2_ap4)
                templateHtml = templateHtml.replace('{{consumptionprice_PE2_ap4}}', body[0].consumptionprice_PE2_ap4)
                templateHtml = templateHtml.replace('{{pricechangefactor_PE2_ap4}}', body[0].pricechangefactor_PE2_ap4)
                templateHtml = templateHtml.replace('{{consumptioncosts_PE2_ap4}}', body[0].consumptioncosts_PE2_ap4)
                templateHtml = templateHtml.replace('{{Total_consumptionprice_PE2}}', body[0].Total_consumptionprice_PE2)
                templateHtml = templateHtml.replace('{{Total_consumptioncosts_PE2}}', body[0].Total_consumptioncosts_PE2)
                templateHtml = templateHtml.replace('{{Zeitraum_von_PE2_gp1}}', body[0].Zeitraum_von_PE2_gp1)
                templateHtml = templateHtml.replace('{{Zeitraum_bis_PE2_gp1}}', body[0].Zeitraum_bis_PE2_gp1)
                templateHtml = templateHtml.replace('{{capacity_PE2_gp1}}', body[0].capacity_PE2_gp1)
                templateHtml = templateHtml.replace('{{capacityprice_PE2_gp1}}', body[0].capacityprice_PE2_gp1)
                templateHtml = templateHtml.replace('{{pricechangefactor_PE2_gp1}}', body[0].pricechangefactor_PE2_gp1)
                templateHtml = templateHtml.replace('{{capacitycosts_PE2_gp1}}', body[0].capacitycosts_PE2_gp1)
                templateHtml = templateHtml.replace('{{Zeitraum_von_PE2_gp2}}', body[0].Zeitraum_von_PE2_gp2)
                templateHtml = templateHtml.replace('{{Zeitraum_bis_PE2_gp2}}', body[0].Zeitraum_bis_PE2_gp2)
                templateHtml = templateHtml.replace('{{capacity_PE2_gp2}}', body[0].capacity_PE2_gp2)
                templateHtml = templateHtml.replace('{{capacityprice_PE2_gp2}}', body[0].capacityprice_PE2_gp2)
                templateHtml = templateHtml.replace('{{pricechangefactor_PE2_gp2}}', body[0].pricechangefactor_PE2_gp2)
                templateHtml = templateHtml.replace('{{capacitycosts_PE2_gp2}}', body[0].capacitycosts_PE2_gp2)
                templateHtml = templateHtml.replace('{{Zeitraum_von_PE2_gp3}}', body[0].Zeitraum_von_PE2_gp3)
                templateHtml = templateHtml.replace('{{Zeitraum_bis_PE2_gp3}}', body[0].Zeitraum_bis_PE2_gp3)
                templateHtml = templateHtml.replace('{{capacity_PE2_gp3}}', body[0].capacity_PE2_gp3)
                templateHtml = templateHtml.replace('{{capacityprice_PE2_gp3}}', body[0].capacityprice_PE2_gp3)
                templateHtml = templateHtml.replace('{{pricechangefactor_PE2_gp3}}', body[0].pricechangefactor_PE2_gp3)
                templateHtml = templateHtml.replace('{{capacitycosts_PE2_gp3}}', body[0].capacitycosts_PE2_gp3)
                templateHtml = templateHtml.replace('{{Zeitraum_von_PE2_gp4}}', body[0].Zeitraum_von_PE2_gp4)
                templateHtml = templateHtml.replace('{{Zeitraum_bis_PE2_gp4}}', body[0].Zeitraum_bis_PE2_gp4)
                templateHtml = templateHtml.replace('{{capacity_PE2_gp4}}', body[0].capacity_PE2_gp4)
                templateHtml = templateHtml.replace('{{capacityprice_PE2_gp4}}', body[0].capacityprice_PE2_gp4)
                templateHtml = templateHtml.replace('{{pricechangefactor_PE2_gp4}}', body[0].pricechangefactor_PE2_gp4)
                templateHtml = templateHtml.replace('{{capacitycosts_PE2_gp4}}', body[0].capacitycosts_PE2_gp4)
                templateHtml = templateHtml.replace('{{capacityunit_PE2}}', body[0].capacityunit_PE2)
                templateHtml = templateHtml.replace('{{capacitypriceunit_PE2}}', body[0].capacitypriceunit_PE2)
                templateHtml = templateHtml.replace('{{Total_capacityprice_PE2}}', body[0].Total_capacityprice_PE2)
                templateHtml = templateHtml.replace('{{Total_capacitycosts_PE2}}', body[0].Total_capacitycosts_PE2)
                templateHtml = templateHtml.replace('{{Position_Grundkosten}}', body[0].Position_Grundkosten)
                templateHtml = templateHtml.replace('{{Erläuterung_Grundkosten}}', body[0].Erläuterung_Grundkosten)
                templateHtml = templateHtml.replace('{{Betrag_netto_Grundkosten}}', body[0].Betrag_netto_Grundkosten)
                templateHtml = templateHtml.replace('{{Umsatzsteuer_Grundkosten}}', body[0].Umsatzsteuer_Grundkosten)
                templateHtml = templateHtml.replace('{{Steuersatz_Grundkosten}}', body[0].Steuersatz_Grundkosten)
                templateHtml = templateHtml.replace('{{Betrag_brutto_Grundkosten}}', body[0].Betrag_brutto_Grundkosten)
                templateHtml = templateHtml.replace('{{Position_Verbrauchskosten}}', body[0].Position_Verbrauchskosten)
                templateHtml = templateHtml.replace('{{Erläuterung_Verbrauchskosten}}', body[0].Erläuterung_Verbrauchskosten)
                templateHtml = templateHtml.replace('{{Betrag_netto_Verbrauchskosten}}', body[0].Betrag_netto_Verbrauchskosten)
                templateHtml = templateHtml.replace('{{Umsatzsteuer_Verbrauchskosten}}', body[0].Umsatzsteuer_Verbrauchskosten)
                templateHtml = templateHtml.replace('{{Steuersatz_Verbrauchskosten}}', body[0].Steuersatz_Verbrauchskosten)
                templateHtml = templateHtml.replace('{{Betrag_brutto_Verbrauchskosten}}', body[0].Betrag_brutto_Verbrauchskosten)
                templateHtml = templateHtml.replace('{{Position_Vorauszahlungen}}', body[0].Position_Vorauszahlungen)
                templateHtml = templateHtml.replace('{{Erläuterung_Vorauszahlungen}}', body[0].Erläuterung_Vorauszahlungen)
                templateHtml = templateHtml.replace('{{Betrag_netto_Vorauszahlungen}}', body[0].Betrag_netto_Vorauszahlungen)
                templateHtml = templateHtml.replace('{{Umsatzsteuer_Vorauszahlungen}}', body[0].Umsatzsteuer_Vorauszahlungen)
                templateHtml = templateHtml.replace('{{Steuersatz_Vorauszahlungen}}', body[0].Steuersatz_Vorauszahlungen)
                templateHtml = templateHtml.replace('{{Betrag_brutto_Vorauszahlungen}}', body[0].Betrag_brutto_Vorauszahlungen)
                templateHtml = templateHtml.replace('{{Position_Gebühren}}', body[0].Position_Gebühren)
                templateHtml = templateHtml.replace('{{Erläuterung_Gebühren}}', body[0].Erläuterung_Gebühren)
                templateHtml = templateHtml.replace('{{Betrag_netto_Gebühren}}', body[0].Betrag_netto_Gebühren)
                templateHtml = templateHtml.replace('{{Umsatzsteuer_Gebühren}}', body[0].Umsatzsteuer_Gebühren)
                templateHtml = templateHtml.replace('{{Steuersatz_Gebühren}}', body[0].Steuersatz_Gebühren)
                templateHtml = templateHtml.replace('{{Betrag_brutto_Gebühren}}', body[0].Betrag_brutto_Gebühren)
                templateHtml = templateHtml.replace('{{Position_Gutschriften}}', body[0].Position_Gutschriften)
                templateHtml = templateHtml.replace('{{Erläuterung_Gutschriften}}', body[0].Erläuterung_Gutschriften)
                templateHtml = templateHtml.replace('{{Betrag_netto_Gutschriften}}', body[0].Betrag_netto_Gutschriften)
                templateHtml = templateHtml.replace('{{Umsatzsteuer_Gutschriften}}', body[0].Umsatzsteuer_Gutschriften)
                templateHtml = templateHtml.replace('{{Steuersatz_Gutschriften}}', body[0].Steuersatz_Gutschriften)
                templateHtml = templateHtml.replace('{{Betrag_brutto_Gutschriften}}', body[0].Betrag_brutto_Gutschriften)
                templateHtml = templateHtml.replace('{{Position_Rabatt}}', body[0].Position_Rabatt)
                templateHtml = templateHtml.replace('{{Erläuterung_Rabatt}}', body[0].Erläuterung_Rabatt)
                templateHtml = templateHtml.replace('{{Betrag_netto_Rabatt}}', body[0].Betrag_netto_Rabatt)
                templateHtml = templateHtml.replace('{{Umsatzsteuer_Rabatt}}', body[0].Umsatzsteuer_Rabatt)
                templateHtml = templateHtml.replace('{{Steuersatz_Rabatt}}', body[0].Steuersatz_Rabatt)
                templateHtml = templateHtml.replace('{{Betrag_brutto_Rabatt}}', body[0].Betrag_brutto_Rabatt)
                templateHtml = templateHtml.replace('{{Position_Zahlbetrag}}', body[0].Position_Zahlbetrag)
                templateHtml = templateHtml.replace('{{Erläuterung_Zahlbetrag}}', body[0].Erläuterung_Zahlbetrag)
                templateHtml = templateHtml.replace('{{Betrag_netto_Zahlbetrag}}', body[0].Betrag_netto_Zahlbetrag)
                templateHtml = templateHtml.replace('{{Umsatzsteuer_Zahlbetrag}}', body[0].Umsatzsteuer_Zahlbetrag)
                templateHtml = templateHtml.replace('{{Steuersatz_Zahlbetrag}}', body[0].Steuersatz_Zahlbetrag)
                templateHtml = templateHtml.replace('{{Betrag_brutto_Zahlbetrag}}', body[0].Betrag_brutto_Zahlbetrag)
                templateHtml = templateHtml.replace('{{Verbrauch}}', body[0].Verbrauch)
                templateHtml = templateHtml.replace('{{Energieentgelte}}', body[0].Energieentgelte)
                templateHtml = templateHtml.replace('{{Gaspreis_Mittel_Jahr}}', body[0].Gaspreis_Mittel_Jahr)
                templateHtml = templateHtml.replace('{{Verbrauch_je_m}}', body[0].Verbrauch_je_m)
                templateHtml = templateHtml.replace('{{Anteil_Warmwasser}}', body[0].Anteil_Warmwasser)
                templateHtml = templateHtml.replace('{{Verbrauch_ref}}', body[0].Verbrauch_ref)
                templateHtml = templateHtml.replace('{{Energieentgelte_ref}}', body[0].Energieentgelte_ref)
                templateHtml = templateHtml.replace('{{Gaspreis_Mittel_Jahr_ref}}', body[0].Gaspreis_Mittel_Jahr_ref)
                templateHtml = templateHtml.replace('{{Verbrauch_je_m_ref}}', body[0].Verbrauch_je_m_ref)
                templateHtml = templateHtml.replace('{{Revision}}', body[0].Revision)
                templateHtml = templateHtml.replace('{{Queue}}', body[0].Queue)

                var options = {
                  height: '16in',
                  width: '10in',
                  format:'A4'
                }
                //Genetate PDF
                pdf.create(templateHtml, options).toFile('./invoicePDF/'+filename, function (err, pdf) {
                  if( err != null){
                    // console.log(t.error(err));
                    res.json({ message: 'pdferror' });
                  }else if(pdf.filename){
                    // console.log("Invoice Successfully Generated!!")
                    var updateque = {};
                    updateque.Queue= "1";
                    fetch(url , {
                          method: 'PATCH',
                          headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify(updateque)
                      }).then(function(response) {
                        //console.log(response);
                        uploadpdf(filename)
                        res.json({ message: 'success' });
                        //t.assert(fs.existsSync(pdf.filename), 'Saves the file to the desired destination')
                      }).catch(error => {
                        // console.log(error);
                        res.json({ message: 'error' });
                      })
                  }else{
                    res.json({ message: 'error' });
                  }
                  // t.assert(pdf.filename, 'Returns the filename')
                })
            }else{
              res.json({ message: 'already' });
            }
          }else{
            // console.log("Invoice Record Not Available!!")
            res.json({ message: 'error' });
          }
      }
  })

});

router.post('/allgenerateinvoice', function(req, res) {

  var fetchurl = "http://localhost:3000/api/invoice_pk_invoicenumber/";
  var allinvoiceData = [];
  allinvoiceData = req.body;

  var pdf_data_array = { success: 0, already: 0 };
  // var url = "http://localhost:3000/api/invoice_pk_invoicenumber/"+invoicenumber

  asyncLoop(allinvoiceData, function (item, next){
    
    setTimeout(function() {
      var apiurl = fetchurl+item;
      if (item == ''){
          next();
          return;
      }else{
        
        request({
            url: apiurl,
            json: true
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                // console.log(body[0].Vertragsnummer)
                if (body && body != '') {
                  if (body[0].Queue == null || body[0].Queue == '') {

                      var template = path.join(__dirname, 'invoicerec.html')

                      // Create PDF Name and convert and get in variable
                      var filename = "Rechnungsdatensatz_"+item+".pdf"
                      var templateHtml = fs.readFileSync(template, 'utf8')

                      // Get Images from path
                      var energicos = path.join('file://', __dirname, 'energicos-logo.png')
                      var stripe = path.join('file://', __dirname, 'stripe.png')  
                      var vertragsnummericon = path.join('file://', __dirname, 'vertragsnummer-icon.png')
                      var objektnummericon = path.join('file://', __dirname, 'objektnummer-icon.png')
                      var rechungsnummericon = path.join('file://', __dirname, 'rechungsnummer-icon.png')
                      var abrechungszeitraumicon = path.join('file://', __dirname, 'abrechungszeitraum-icon.png')
                      var zehibetragbruttoicon = path.join('file://', __dirname, 'zehibetrag_brutto-icon.png')

                      var graphickey = path.join('file://', __dirname, 'graphic-key.png')
                      var piechart = path.join('file://', __dirname, 'pie-chart.svg')

                      var datumicon = path.join('file://', __dirname, 'datum-icon.png')
                      var ansprechpartnericon = path.join('file://', __dirname, 'ansprechpartner-icon.png')
                      var telefonicon = path.join('file://', __dirname, 'telefon-icon.png')

                      // Assign value to images parameter.
                      templateHtml = templateHtml.replace('{{energicos}}', energicos)
                      templateHtml = templateHtml.replace('{{energicos2}}', energicos)
                      templateHtml = templateHtml.replace('{{energicos3}}', energicos)
                      templateHtml = templateHtml.replace('{{energicos4}}', energicos)
                      templateHtml = templateHtml.replace('{{stripe}}', stripe)
                      templateHtml = templateHtml.replace('{{stripe}}', stripe)
                      templateHtml = templateHtml.replace('{{stripe2}}', stripe)
                      templateHtml = templateHtml.replace('{{stripe3}}', stripe)
                      templateHtml = templateHtml.replace('{{stripe4}}', stripe)
                      templateHtml = templateHtml.replace('{{vertragsnummericon}}', vertragsnummericon)
                      templateHtml = templateHtml.replace('{{objektnummericon}}', objektnummericon)
                      templateHtml = templateHtml.replace('{{rechungsnummericon}}', rechungsnummericon)
                      templateHtml = templateHtml.replace('{{abrechungszeitraumicon}}', abrechungszeitraumicon)
                      templateHtml = templateHtml.replace('{{zehibetragbruttoicon}}', zehibetragbruttoicon)

                      templateHtml = templateHtml.replace('{{graphickey}}', graphickey) 
                      templateHtml = templateHtml.replace('{{piechart}}', piechart)

                      templateHtml = templateHtml.replace('{{datumicon}}', datumicon)
                      templateHtml = templateHtml.replace('{{datumicon2}}', datumicon)
                      templateHtml = templateHtml.replace('{{datumicon3}}', datumicon)
                      templateHtml = templateHtml.replace('{{datumicon4}}', datumicon)
                      templateHtml = templateHtml.replace('{{ansprechpartnericon}}', ansprechpartnericon)
                      templateHtml = templateHtml.replace('{{ansprechpartnericon2}}', ansprechpartnericon)
                      templateHtml = templateHtml.replace('{{ansprechpartnericon3}}', ansprechpartnericon)
                      templateHtml = templateHtml.replace('{{ansprechpartnericon4}}', ansprechpartnericon)
                      templateHtml = templateHtml.replace('{{telefonicon}}', telefonicon)
                      templateHtml = templateHtml.replace('{{telefonicon2}}', telefonicon)
                      templateHtml = templateHtml.replace('{{telefonicon3}}', telefonicon)
                      templateHtml = templateHtml.replace('{{telefonicon4}}', telefonicon)

                      // Assign HTML data to the keys
                      templateHtml = templateHtml.replace('{{Kundenname}}', body[0].Kundenname)
                      templateHtml = templateHtml.replace('{{Kundenname2}}', body[0].Kundenname)
                      templateHtml = templateHtml.replace('{{Kundenname3}}', body[0].Kundenname)
                      templateHtml = templateHtml.replace('{{Kundenname4}}', body[0].Kundenname)

                      templateHtml = templateHtml.replace('{{KD_Strasse}}', body[0].KD_Strasse)
                      templateHtml = templateHtml.replace('{{KD_Strasse2}}', body[0].KD_Strasse)
                      templateHtml = templateHtml.replace('{{KD_Strasse3}}', body[0].KD_Strasse)
                      templateHtml = templateHtml.replace('{{KD_Strasse4}}', body[0].KD_Strasse)

                      templateHtml = templateHtml.replace('{{Rechnungsdatensatz}}', body[0].Rechnungsdatensatz)

                      templateHtml = templateHtml.replace('{{Vertragsnummer}}', body[0].Vertragsnummer)
                      templateHtml = templateHtml.replace('{{Vertragsnummer2}}', body[0].Vertragsnummer)
                      templateHtml = templateHtml.replace('{{Vertragsnummer3}}', body[0].Vertragsnummer)
                      templateHtml = templateHtml.replace('{{Vertragsnummer4}}', body[0].Vertragsnummer)

                      templateHtml = templateHtml.replace('{{Rechnungsnummer}}', body[0].Rechnungsnummer)
                      templateHtml = templateHtml.replace('{{Rechnungsnummer2}}', body[0].Rechnungsnummer)
                      templateHtml = templateHtml.replace('{{Rechnungsnummer3}}', body[0].Rechnungsnummer)
                      templateHtml = templateHtml.replace('{{Rechnungsnummer4}}', body[0].Rechnungsnummer)

                      templateHtml = templateHtml.replace('{{Rechnung_von}}', body[0].Rechnung_von)
                      templateHtml = templateHtml.replace('{{Rechnung_bis}}', body[0].Rechnung_bis)

                      templateHtml = templateHtml.replace('{{Rechnungsdatum}}', body[0].Rechnungsdatum)
                      templateHtml = templateHtml.replace('{{Rechnungsdatum2}}', body[0].Rechnungsdatum)
                      templateHtml = templateHtml.replace('{{Rechnungsdatum3}}', body[0].Rechnungsdatum)
                      templateHtml = templateHtml.replace('{{Rechnungsdatum4}}', body[0].Rechnungsdatum)

                      templateHtml = templateHtml.replace('{{Zahlungsziel}}', body[0].Zahlungsziel)
                      templateHtml = templateHtml.replace('{{Debitorennummer}}', body[0].Debitorennummer)

                      templateHtml = templateHtml.replace('{{KD_PLZ_Ort}}', body[0].KD_PLZ_Ort)
                      templateHtml = templateHtml.replace('{{KD_PLZ_Ort2}}', body[0].KD_PLZ_Ort)
                      templateHtml = templateHtml.replace('{{KD_PLZ_Ort3}}', body[0].KD_PLZ_Ort)
                      templateHtml = templateHtml.replace('{{KD_PLZ_Ort4}}', body[0].KD_PLZ_Ort)

                      templateHtml = templateHtml.replace('{{KD_E_Mail}}', body[0].KD_E_Mail)
                      templateHtml = templateHtml.replace('{{KD_E_Mail2}}', body[0].KD_E_Mail)
                      templateHtml = templateHtml.replace('{{KD_E_Mail3}}', body[0].KD_E_Mail)

                      templateHtml = templateHtml.replace('{{Ansprechpartner}}', body[0].Ansprechpartner)
                      templateHtml = templateHtml.replace('{{Ansprechpartner2}}', body[0].Ansprechpartner)
                      templateHtml = templateHtml.replace('{{Ansprechpartner3}}', body[0].Ansprechpartner)
                      templateHtml = templateHtml.replace('{{Ansprechpartner4}}', body[0].Ansprechpartner)

                      templateHtml = templateHtml.replace('{{SEPA_Lastschriftmandat}}', body[0].SEPA_Lastschriftmandat)
                      templateHtml = templateHtml.replace('{{IBAN}}', body[0].IBAN)
                      templateHtml = templateHtml.replace('{{BIC}}', body[0].BIC)
                      templateHtml = templateHtml.replace('{{c_o}}', body[0].c_o)
                      templateHtml = templateHtml.replace('{{RE_Name}}', body[0].RE_Name)
                      templateHtml = templateHtml.replace('{{RE_Strasse}}', body[0].RE_Strasse)
                      templateHtml = templateHtml.replace('{{RE_PLZ_Ort}}', body[0].RE_PLZ_Ort)
                      
                      templateHtml = templateHtml.replace('{{Objektnummer}}', body[0].Objektnummer)
                      templateHtml = templateHtml.replace('{{Objektnummer2}}', body[0].Objektnummer)
                      templateHtml = templateHtml.replace('{{Objektnummer3}}', body[0].Objektnummer)
                      templateHtml = templateHtml.replace('{{Objektnummer4}}', body[0].Objektnummer)

                      templateHtml = templateHtml.replace('{{Lieferadresse}}', body[0].Lieferadresse)
                      templateHtml = templateHtml.replace('{{Lieferadresse2}}', body[0].Lieferadresse)
                      templateHtml = templateHtml.replace('{{Lieferadresse3}}', body[0].Lieferadresse)

                      templateHtml = templateHtml.replace('{{PLZ_Liegenschaft}}', body[0].PLZ_Liegenschaft)
                      templateHtml = templateHtml.replace('{{Messbereich_MB1}}', body[0].Messbereich_MB1)
                      templateHtml = templateHtml.replace('{{Zählernummer_MB1_p1}}', body[0].Zählernummer_MB1_p1)
                      templateHtml = templateHtml.replace('{{Zeitraum_von_MB1_p1}}', body[0].Zeitraum_von_MB1_p1)
                      templateHtml = templateHtml.replace('{{Zeitraum_bis_MB1_p1}}', body[0].Zeitraum_bis_MB1_p1)
                      templateHtml = templateHtml.replace('{{Zählerstand_von_MB1_p1}}', body[0].Zählerstand_von_MB1_p1)
                      templateHtml = templateHtml.replace('{{Zählerstand_bis_MB1_p1}}', body[0].Zählerstand_bis_MB1_p1)
                      templateHtml = templateHtml.replace('{{Verbrauch_in_Verbrauchseinheit_MB1_p1}}', body[0].Verbrauch_in_Verbrauchseinheit_MB1_p1)
                      templateHtml = templateHtml.replace('{{Umrechnungsfaktor_MB1_p1}}', body[0].Umrechnungsfaktor_MB1_p1)
                      templateHtml = templateHtml.replace('{{Verbrauch_in_MWh_MB1_p1}}', body[0].Verbrauch_in_MWh_MB1_p1)
                      templateHtml = templateHtml.replace('{{Zählernummer_MB1_p2}}', body[0].Zählernummer_MB1_p2)
                      templateHtml = templateHtml.replace('{{Zeitraum_von_MB1_p2}}', body[0].Zeitraum_von_MB1_p2)
                      templateHtml = templateHtml.replace('{{Zeitraum_bis_MB1_p2}}', body[0].Zeitraum_bis_MB1_p2)
                      templateHtml = templateHtml.replace('{{Zählerstand_von_MB1_p2}}', body[0].Zählerstand_von_MB1_p2)
                      templateHtml = templateHtml.replace('{{Zählerstand_bis_MB1_p2}}', body[0].Zählerstand_bis_MB1_p2)
                      templateHtml = templateHtml.replace('{{Verbrauch_in_Verbrauchseinheit_MB1_p2}}', body[0].Verbrauch_in_Verbrauchseinheit_MB1_p2)
                      templateHtml = templateHtml.replace('{{Umrechnungsfaktor_MB1_p2}}', body[0].Umrechnungsfaktor_MB1_p2)
                      templateHtml = templateHtml.replace('{{Verbrauch_in_MWh_MB1_p2}}', body[0].Verbrauch_in_MWh_MB1_p2)
                      templateHtml = templateHtml.replace('{{Zählernummer_MB1_p3}}', body[0].Zählernummer_MB1_p3)
                      templateHtml = templateHtml.replace('{{Zeitraum_von_MB1_p3}}', body[0].Zeitraum_von_MB1_p3)
                      templateHtml = templateHtml.replace('{{Zeitraum_bis_MB1_p3}}', body[0].Zeitraum_bis_MB1_p3)
                      templateHtml = templateHtml.replace('{{Zählerstand_von_MB1_p3}}', body[0].Zählerstand_von_MB1_p3)
                      templateHtml = templateHtml.replace('{{Zählerstand_bis_MB1_p3}}', body[0].Zählerstand_bis_MB1_p3)
                      templateHtml = templateHtml.replace('{{Verbrauch_in_Verbrauchseinheit_MB1_p3}}', body[0].Verbrauch_in_Verbrauchseinheit_MB1_p3)
                      templateHtml = templateHtml.replace('{{Umrechnungsfaktor_MB1_p3}}', body[0].Umrechnungsfaktor_MB1_p3)
                      templateHtml = templateHtml.replace('{{Verbrauch_in_MWh_MB1_p3}}', body[0].Verbrauch_in_MWh_MB1_p3)
                      templateHtml = templateHtml.replace('{{Zählernummer_MB1_p4}}', body[0].Zählernummer_MB1_p4)
                      templateHtml = templateHtml.replace('{{Zeitraum_von_MB1_p4}}', body[0].Zeitraum_von_MB1_p4)
                      templateHtml = templateHtml.replace('{{Zeitraum_bis_MB1_p4}}', body[0].Zeitraum_bis_MB1_p4)
                      templateHtml = templateHtml.replace('{{Zählerstand_von_MB1_p4}}', body[0].Zählerstand_von_MB1_p4)
                      templateHtml = templateHtml.replace('{{Zählerstand_bis_MB1_p4}}', body[0].Zählerstand_bis_MB1_p4)
                      templateHtml = templateHtml.replace('{{Verbrauch_in_Verbrauchseinheit_MB1_p4}}', body[0].Verbrauch_in_Verbrauchseinheit_MB1_p4)
                      templateHtml = templateHtml.replace('{{Umrechnungsfaktor_MB1_p4}}', body[0].Umrechnungsfaktor_MB1_p4)
                      templateHtml = templateHtml.replace('{{Verbrauch_in_MWh_MB1_p4}}', body[0].Verbrauch_in_MWh_MB1_p4)
                      templateHtml = templateHtml.replace('{{Zählernummer_MB1_p5}}', body[0].Zählernummer_MB1_p5)
                      templateHtml = templateHtml.replace('{{Zeitraum_von_MB1_p5}}', body[0].Zeitraum_von_MB1_p5)
                      templateHtml = templateHtml.replace('{{Zeitraum_bis_MB1_p5}}', body[0].Zeitraum_bis_MB1_p5)
                      templateHtml = templateHtml.replace('{{Zählerstand_von_MB1_p5}}', body[0].Zählerstand_von_MB1_p5)
                      templateHtml = templateHtml.replace('{{Zählerstand_bis_MB1_p5}}', body[0].Zählerstand_bis_MB1_p5)
                      templateHtml = templateHtml.replace('{{Verbrauch_in_Verbrauchseinheit_MB1_p5}}', body[0].Verbrauch_in_Verbrauchseinheit_MB1_p5)
                      templateHtml = templateHtml.replace('{{Umrechnungsfaktor_MB1_p5}}', body[0].Umrechnungsfaktor_MB1_p5)
                      templateHtml = templateHtml.replace('{{Verbrauch_in_MWh_MB1_p5}}', body[0].Verbrauch_in_MWh_MB1_p5)
                      templateHtml = templateHtml.replace('{{Verbrauchseinheit_MB1}}', body[0].Verbrauchseinheit_MB1)
                      templateHtml = templateHtml.replace('{{Total_Verbrauch_in_Verbrauchseinheit_MB1}}', body[0].Total_Verbrauch_in_Verbrauchseinheit_MB1)
                      templateHtml = templateHtml.replace('{{Total_Verbrauch_in_MWh_MB1}}', body[0].Total_Verbrauch_in_MWh_MB1)
                      templateHtml = templateHtml.replace('{{Zeitraum_von_MB1_ap1}}', body[0].Zeitraum_von_MB1_ap1)
                      templateHtml = templateHtml.replace('{{Zeitraum_bis_MB1_ap1}}', body[0].Zeitraum_bis_MB1_ap1)
                      templateHtml = templateHtml.replace('{{Verbrauch_in_MWh_MB1_ap1}}', body[0].Verbrauch_in_MWh_MB1_ap1)
                      templateHtml = templateHtml.replace('{{Verbrauchspreis_MB1_ap1}}', body[0].Verbrauchspreis_MB1_ap1)
                      templateHtml = templateHtml.replace('{{Änderungsfaktor_MB1_ap1}}', body[0].Änderungsfaktor_MB1_ap1)
                      templateHtml = templateHtml.replace('{{Verbrauchskosten_MB1_ap1}}', body[0].Verbrauchskosten_MB1_ap1)
                      templateHtml = templateHtml.replace('{{Zeitraum_von_MB1_ap2}}', body[0].Zeitraum_von_MB1_ap2)
                      templateHtml = templateHtml.replace('{{Zeitraum_bis_MB1_ap2}}', body[0].Zeitraum_bis_MB1_ap2)
                      templateHtml = templateHtml.replace('{{Verbrauch_in_MWh_MB1_ap2}}', body[0].Verbrauch_in_MWh_MB1_ap2)
                      templateHtml = templateHtml.replace('{{Verbrauchspreis_MB1_ap2}}', body[0].Verbrauchspreis_MB1_ap2)
                      templateHtml = templateHtml.replace('{{Änderungsfaktor_MB1_ap2}}', body[0].Änderungsfaktor_MB1_ap2)
                      templateHtml = templateHtml.replace('{{Verbrauchskosten_MB1_ap2}}', body[0].Verbrauchskosten_MB1_ap2)
                      templateHtml = templateHtml.replace('{{Zeitraum_von_MB1_ap3}}', body[0].Zeitraum_von_MB1_ap3)
                      templateHtml = templateHtml.replace('{{Zeitraum_bis_MB1_ap3}}', body[0].Zeitraum_bis_MB1_ap3)
                      templateHtml = templateHtml.replace('{{Verbrauch_in_MWh_MB1_ap3}}', body[0].Verbrauch_in_MWh_MB1_ap3)
                      templateHtml = templateHtml.replace('{{Verbrauchspreis_MB1_ap3}}', body[0].Verbrauchspreis_MB1_ap3)
                      templateHtml = templateHtml.replace('{{Änderungsfaktor_MB1_ap3}}', body[0].Änderungsfaktor_MB1_ap3)
                      templateHtml = templateHtml.replace('{{Verbrauchskosten_MB1_ap3}}', body[0].Verbrauchskosten_MB1_ap3)
                      templateHtml = templateHtml.replace('{{Zeitraum_von_MB1_ap4}}', body[0].Zeitraum_von_MB1_ap4)
                      templateHtml = templateHtml.replace('{{Zeitraum_bis_MB1_ap4}}', body[0].Zeitraum_bis_MB1_ap4)
                      templateHtml = templateHtml.replace('{{Verbrauch_in_MWh_MB1_ap4}}', body[0].Verbrauch_in_MWh_MB1_ap4)
                      templateHtml = templateHtml.replace('{{Verbrauchspreis_MB1_ap4}}', body[0].Verbrauchspreis_MB1_ap4)
                      templateHtml = templateHtml.replace('{{Änderungsfaktor_MB1_ap4}}', body[0].Änderungsfaktor_MB1_ap4)
                      templateHtml = templateHtml.replace('{{Verbrauchskosten_MB1_ap4}}', body[0].Verbrauchskosten_MB1_ap4)
                      templateHtml = templateHtml.replace('{{Total_Verbrauchspreis_MB1}}', body[0].Total_Verbrauchspreis_MB1)
                      templateHtml = templateHtml.replace('{{Total_Verbrauchskosten_MB1}}', body[0].Total_Verbrauchskosten_MB1)
                      templateHtml = templateHtml.replace('{{Zeitraum_von_MB1_gp1}}', body[0].Zeitraum_von_MB1_gp1)
                      templateHtml = templateHtml.replace('{{Zeitraum_bis_MB1_gp1}}', body[0].Zeitraum_bis_MB1_gp1)
                      templateHtml = templateHtml.replace('{{Leistung_MB1_gp1}}', body[0].Leistung_MB1_gp1)
                      templateHtml = templateHtml.replace('{{Grundpreis_MB1_gp1}}', body[0].Grundpreis_MB1_gp1)
                      templateHtml = templateHtml.replace('{{Änderungsfaktor_MB1_gp1}}', body[0].Änderungsfaktor_MB1_gp1)
                      templateHtml = templateHtml.replace('{{Grundkosten_MB1_gp1}}', body[0].Grundkosten_MB1_gp1)
                      templateHtml = templateHtml.replace('{{Zeitraum_von_MB1_gp2}}', body[0].Zeitraum_von_MB1_gp2)
                      templateHtml = templateHtml.replace('{{Zeitraum_bis_MB1_gp2}}', body[0].Zeitraum_bis_MB1_gp2)
                      templateHtml = templateHtml.replace('{{Leistung_MB1_gp2}}', body[0].Leistung_MB1_gp2)
                      templateHtml = templateHtml.replace('{{Grundpreis_MB1_gp2}}', body[0].Grundpreis_MB1_gp2)
                      templateHtml = templateHtml.replace('{{Änderungsfaktor_MB1_gp2}}', body[0].Änderungsfaktor_MB1_gp2)
                      templateHtml = templateHtml.replace('{{Grundkosten_MB1_gp2}}', body[0].Grundkosten_MB1_gp2)
                      templateHtml = templateHtml.replace('{{Zeitraum_von_MB1_gp3}}', body[0].Zeitraum_von_MB1_gp3)
                      templateHtml = templateHtml.replace('{{Zeitraum_bis_MB1_gp3}}', body[0].Zeitraum_bis_MB1_gp3)
                      templateHtml = templateHtml.replace('{{Leistung_MB1_gp3}}', body[0].Leistung_MB1_gp3)
                      templateHtml = templateHtml.replace('{{Grundpreis_MB1_gp3}}', body[0].Grundpreis_MB1_gp3)
                      templateHtml = templateHtml.replace('{{Änderungsfaktor_MB1_gp3}}', body[0].Änderungsfaktor_MB1_gp3)
                      templateHtml = templateHtml.replace('{{Grundkosten_MB1_gp3}}', body[0].Grundkosten_MB1_gp3)
                      templateHtml = templateHtml.replace('{{Zeitraum_von_MB1_gp4}}', body[0].Zeitraum_von_MB1_gp4)
                      templateHtml = templateHtml.replace('{{Zeitraum_bis_MB1_gp4}}', body[0].Zeitraum_bis_MB1_gp4)
                      templateHtml = templateHtml.replace('{{Leistung_MB1_gp4}}', body[0].Leistung_MB1_gp4)
                      templateHtml = templateHtml.replace('{{Grundpreis_MB1_gp4}}', body[0].Grundpreis_MB1_gp4)
                      templateHtml = templateHtml.replace('{{Änderungsfaktor_MB1_gp4}}', body[0].Änderungsfaktor_MB1_gp4)
                      templateHtml = templateHtml.replace('{{Grundkosten_MB1_gp4}}', body[0].Grundkosten_MB1_gp4)
                      templateHtml = templateHtml.replace('{{Leistungseinheit_MB1}}', body[0].Leistungseinheit_MB1)
                      templateHtml = templateHtml.replace('{{Grundpreiseinheit_MB1}}', body[0].Grundpreiseinheit_MB1)
                      templateHtml = templateHtml.replace('{{Total_Grundpreis_MB1}}', body[0].Total_Grundpreis_MB1)
                      templateHtml = templateHtml.replace('{{Total_Grundkosten_MB1}}', body[0].Total_Grundkosten_MB1)
                      templateHtml = templateHtml.replace('{{Productelement_PE2}}', body[0].Productelement_PE2)
                      templateHtml = templateHtml.replace('{{Zählernummer_PE2_p1}}', body[0].Zählernummer_PE2_p1)
                      templateHtml = templateHtml.replace('{{Zeitraum_von_PE2_p1}}', body[0].Zeitraum_von_PE2_p1)
                      templateHtml = templateHtml.replace('{{Zeitraum_bis_PE2_p1}}', body[0].Zeitraum_bis_PE2_p1)
                      templateHtml = templateHtml.replace('{{Zählerstand_von_PE2_p1}}', body[0].Zählerstand_von_PE2_p1)
                      templateHtml = templateHtml.replace('{{Zählerstand_bis_PE2_p1}}', body[0].Zählerstand_bis_PE2_p1)
                      templateHtml = templateHtml.replace('{{Verbrauch_in_Verbrauchseinheit_PE2_p1}}', body[0].Verbrauch_in_Verbrauchseinheit_PE2_p1)
                      templateHtml = templateHtml.replace('{{Umrachnungsfaktor_PE2_p1}}', body[0].Umrachnungsfaktor_PE2_p1)
                      templateHtml = templateHtml.replace('{{Verbrauch_in_MWh_PE2_p1}}', body[0].Verbrauch_in_MWh_PE2_p1)
                      templateHtml = templateHtml.replace('{{Zählernummer_PE2_p2}}', body[0].Zählernummer_PE2_p2)
                      templateHtml = templateHtml.replace('{{Zeitraum_von_PE2_p2}}', body[0].Zeitraum_von_PE2_p2)
                      templateHtml = templateHtml.replace('{{Zeitraum_bis_PE2_p2}}', body[0].Zeitraum_bis_PE2_p2)
                      templateHtml = templateHtml.replace('{{Zählerstand_von_PE2_p2}}', body[0].Zählerstand_von_PE2_p2)
                      templateHtml = templateHtml.replace('{{Zählerstand_bis_PE2_p2}}', body[0].Zählerstand_bis_PE2_p2)
                      templateHtml = templateHtml.replace('{{Verbrauch_in_Verbrauchseinheit_von_PE2_p2}}', body[0].Verbrauch_in_Verbrauchseinheit_von_PE2_p2)
                      templateHtml = templateHtml.replace('{{Umrechnungsfaktor_PE2_p2}}', body[0].Umrechnungsfaktor_PE2_p2)
                      templateHtml = templateHtml.replace('{{Verbrauch_in_MWh_PE2_p2}}', body[0].Verbrauch_in_MWh_PE2_p2)
                      templateHtml = templateHtml.replace('{{Zählernummer_PE2_p3}}', body[0].Zählernummer_PE2_p3)
                      templateHtml = templateHtml.replace('{{Zeitraum_von_PE2_p3}}', body[0].Zeitraum_von_PE2_p3)
                      templateHtml = templateHtml.replace('{{Zeitraum_bis_PE2_p3}}', body[0].Zeitraum_bis_PE2_p3)
                      templateHtml = templateHtml.replace('{{Zählerstand_von_PE2_p3}}', body[0].Zählerstand_von_PE2_p3)
                      templateHtml = templateHtml.replace('{{Zählerstand_bis_PE2_p3}}', body[0].Zählerstand_bis_PE2_p3)
                      templateHtml = templateHtml.replace('{{Verbrauch_in_Verbrauchseinheit_PE2_p3}}', body[0].Verbrauch_in_Verbrauchseinheit_PE2_p3)
                      templateHtml = templateHtml.replace('{{Umrechnungsfaktor_PE2_p3}}', body[0].Umrechnungsfaktor_PE2_p3)
                      templateHtml = templateHtml.replace('{{Verbrauch_in_MWh_PE2_p3}}', body[0].Verbrauch_in_MWh_PE2_p3)
                      templateHtml = templateHtml.replace('{{Zählernummer_PE2_p4}}', body[0].Zählernummer_PE2_p4)
                      templateHtml = templateHtml.replace('{{Zeitraum_von_PE2_p4}}', body[0].Zeitraum_von_PE2_p4)
                      templateHtml = templateHtml.replace('{{Zeitraum_bis_PE2_p4}}', body[0].Zeitraum_bis_PE2_p4)
                      templateHtml = templateHtml.replace('{{Zählerstand_von_PE2_p4}}', body[0].Zählerstand_von_PE2_p4)
                      templateHtml = templateHtml.replace('{{Zählerstand_bis_PE2_p4}}', body[0].Zählerstand_bis_PE2_p4)
                      templateHtml = templateHtml.replace('{{Verbrauch_in_Verbrauchseinheit_PE2_p4}}', body[0].Verbrauch_in_Verbrauchseinheit_PE2_p4)
                      templateHtml = templateHtml.replace('{{Umrechnungsfaktor_PE2_p4}}', body[0].Umrechnungsfaktor_PE2_p4)
                      templateHtml = templateHtml.replace('{{Verbrauch_in_MWh_PE2_p4}}', body[0].Verbrauch_in_MWh_PE2_p4)
                      templateHtml = templateHtml.replace('{{Zählernummer_PE2_p5}}', body[0].Zählernummer_PE2_p5)
                      templateHtml = templateHtml.replace('{{Zeitraum_von_PE2_p5}}', body[0].Zeitraum_von_PE2_p5)
                      templateHtml = templateHtml.replace('{{Zeitraum_bis_PE2_p5}}', body[0].Zeitraum_bis_PE2_p5)
                      templateHtml = templateHtml.replace('{{Zählerstand_von_PE2_p5}}', body[0].Zählerstand_von_PE2_p5)
                      templateHtml = templateHtml.replace('{{Zählerstand_bis_PE2_p5}}', body[0].Zählerstand_bis_PE2_p5)
                      templateHtml = templateHtml.replace('{{Verbrauch_in_Verbrauchseinheit_PE2_p5}}', body[0].Verbrauch_in_Verbrauchseinheit_PE2_p5)
                      templateHtml = templateHtml.replace('{{Umrechnungsfaktor_PE2_p5}}', body[0].Umrechnungsfaktor_PE2_p5)
                      templateHtml = templateHtml.replace('{{Verbrauch_in_MWh_PE2_p5}}', body[0].Verbrauch_in_MWh_PE2_p5)
                      templateHtml = templateHtml.replace('{{Verbrauchseinheit_PE2}}', body[0].Verbrauchseinheit_PE2)
                      templateHtml = templateHtml.replace('{{Total_Verbrauch_in_Verbrauchseinheit_PE2}}', body[0].Total_Verbrauch_in_Verbrauchseinheit_PE2)
                      templateHtml = templateHtml.replace('{{Total_consumption_in_MWh_PE2}}', body[0].Total_consumption_in_MWh_PE2)
                      templateHtml = templateHtml.replace('{{Zeitraum_von_PE2_ap1}}', body[0].Zeitraum_von_PE2_ap1)
                      templateHtml = templateHtml.replace('{{Zeitraum_bis_PE2_ap1}}', body[0].Zeitraum_bis_PE2_ap1)
                      templateHtml = templateHtml.replace('{{Verbrauch_in_MWh_PE2_ap1}}', body[0].Verbrauch_in_MWh_PE2_ap1)
                      templateHtml = templateHtml.replace('{{consumptionprice_PE2_ap1}}', body[0].consumptionprice_PE2_ap1)
                      templateHtml = templateHtml.replace('{{pricechangefactor_PE2_ap1}}', body[0].pricechangefactor_PE2_ap1)
                      templateHtml = templateHtml.replace('{{consumptioncosts_PE2_ap1}}', body[0].consumptioncosts_PE2_ap1)
                      templateHtml = templateHtml.replace('{{Zeitraum_von_PE2_ap2}}', body[0].Zeitraum_von_PE2_ap2)
                      templateHtml = templateHtml.replace('{{Zeitraum_bis_PE2_ap2}}', body[0].Zeitraum_bis_PE2_ap2)
                      templateHtml = templateHtml.replace('{{Verbrauch_in_MWh_PE2_ap2}}', body[0].Verbrauch_in_MWh_PE2_ap2)
                      templateHtml = templateHtml.replace('{{consumptionprice_PE2_ap2}}', body[0].consumptionprice_PE2_ap2)
                      templateHtml = templateHtml.replace('{{pricechangefactor_PE2_ap2}}', body[0].pricechangefactor_PE2_ap2)
                      templateHtml = templateHtml.replace('{{consumptioncosts_PE2_ap2}}', body[0].consumptioncosts_PE2_ap2)
                      templateHtml = templateHtml.replace('{{Zeitraum_von_PE2_ap3}}', body[0].Zeitraum_von_PE2_ap3)
                      templateHtml = templateHtml.replace('{{billing_to_PE2_ap3}}', body[0].billing_to_PE2_ap3)
                      templateHtml = templateHtml.replace('{{Verbrauch_in_MWh_PE2_ap3}}', body[0].Verbrauch_in_MWh_PE2_ap3)
                      templateHtml = templateHtml.replace('{{consumptionprice_PE2_ap3}}', body[0].consumptionprice_PE2_ap3)
                      templateHtml = templateHtml.replace('{{pricechangefactor_PE2_ap3}}', body[0].pricechangefactor_PE2_ap3)
                      templateHtml = templateHtml.replace('{{consumptioncosts_PE2_ap3}}', body[0].consumptioncosts_PE2_ap3)
                      templateHtml = templateHtml.replace('{{Zeitraum_von_PE2_ap4}}', body[0].Zeitraum_von_PE2_ap4)
                      templateHtml = templateHtml.replace('{{Zeitraum_bis_PE2_ap4}}', body[0].Zeitraum_bis_PE2_ap4)
                      templateHtml = templateHtml.replace('{{Verbrauch_in_MWh_PE2_ap4}}', body[0].Verbrauch_in_MWh_PE2_ap4)
                      templateHtml = templateHtml.replace('{{consumptionprice_PE2_ap4}}', body[0].consumptionprice_PE2_ap4)
                      templateHtml = templateHtml.replace('{{pricechangefactor_PE2_ap4}}', body[0].pricechangefactor_PE2_ap4)
                      templateHtml = templateHtml.replace('{{consumptioncosts_PE2_ap4}}', body[0].consumptioncosts_PE2_ap4)
                      templateHtml = templateHtml.replace('{{Total_consumptionprice_PE2}}', body[0].Total_consumptionprice_PE2)
                      templateHtml = templateHtml.replace('{{Total_consumptioncosts_PE2}}', body[0].Total_consumptioncosts_PE2)
                      templateHtml = templateHtml.replace('{{Zeitraum_von_PE2_gp1}}', body[0].Zeitraum_von_PE2_gp1)
                      templateHtml = templateHtml.replace('{{Zeitraum_bis_PE2_gp1}}', body[0].Zeitraum_bis_PE2_gp1)
                      templateHtml = templateHtml.replace('{{capacity_PE2_gp1}}', body[0].capacity_PE2_gp1)
                      templateHtml = templateHtml.replace('{{capacityprice_PE2_gp1}}', body[0].capacityprice_PE2_gp1)
                      templateHtml = templateHtml.replace('{{pricechangefactor_PE2_gp1}}', body[0].pricechangefactor_PE2_gp1)
                      templateHtml = templateHtml.replace('{{capacitycosts_PE2_gp1}}', body[0].capacitycosts_PE2_gp1)
                      templateHtml = templateHtml.replace('{{Zeitraum_von_PE2_gp2}}', body[0].Zeitraum_von_PE2_gp2)
                      templateHtml = templateHtml.replace('{{Zeitraum_bis_PE2_gp2}}', body[0].Zeitraum_bis_PE2_gp2)
                      templateHtml = templateHtml.replace('{{capacity_PE2_gp2}}', body[0].capacity_PE2_gp2)
                      templateHtml = templateHtml.replace('{{capacityprice_PE2_gp2}}', body[0].capacityprice_PE2_gp2)
                      templateHtml = templateHtml.replace('{{pricechangefactor_PE2_gp2}}', body[0].pricechangefactor_PE2_gp2)
                      templateHtml = templateHtml.replace('{{capacitycosts_PE2_gp2}}', body[0].capacitycosts_PE2_gp2)
                      templateHtml = templateHtml.replace('{{Zeitraum_von_PE2_gp3}}', body[0].Zeitraum_von_PE2_gp3)
                      templateHtml = templateHtml.replace('{{Zeitraum_bis_PE2_gp3}}', body[0].Zeitraum_bis_PE2_gp3)
                      templateHtml = templateHtml.replace('{{capacity_PE2_gp3}}', body[0].capacity_PE2_gp3)
                      templateHtml = templateHtml.replace('{{capacityprice_PE2_gp3}}', body[0].capacityprice_PE2_gp3)
                      templateHtml = templateHtml.replace('{{pricechangefactor_PE2_gp3}}', body[0].pricechangefactor_PE2_gp3)
                      templateHtml = templateHtml.replace('{{capacitycosts_PE2_gp3}}', body[0].capacitycosts_PE2_gp3)
                      templateHtml = templateHtml.replace('{{Zeitraum_von_PE2_gp4}}', body[0].Zeitraum_von_PE2_gp4)
                      templateHtml = templateHtml.replace('{{Zeitraum_bis_PE2_gp4}}', body[0].Zeitraum_bis_PE2_gp4)
                      templateHtml = templateHtml.replace('{{capacity_PE2_gp4}}', body[0].capacity_PE2_gp4)
                      templateHtml = templateHtml.replace('{{capacityprice_PE2_gp4}}', body[0].capacityprice_PE2_gp4)
                      templateHtml = templateHtml.replace('{{pricechangefactor_PE2_gp4}}', body[0].pricechangefactor_PE2_gp4)
                      templateHtml = templateHtml.replace('{{capacitycosts_PE2_gp4}}', body[0].capacitycosts_PE2_gp4)
                      templateHtml = templateHtml.replace('{{capacityunit_PE2}}', body[0].capacityunit_PE2)
                      templateHtml = templateHtml.replace('{{capacitypriceunit_PE2}}', body[0].capacitypriceunit_PE2)
                      templateHtml = templateHtml.replace('{{Total_capacityprice_PE2}}', body[0].Total_capacityprice_PE2)
                      templateHtml = templateHtml.replace('{{Total_capacitycosts_PE2}}', body[0].Total_capacitycosts_PE2)
                      templateHtml = templateHtml.replace('{{Position_Grundkosten}}', body[0].Position_Grundkosten)
                      templateHtml = templateHtml.replace('{{Erläuterung_Grundkosten}}', body[0].Erläuterung_Grundkosten)
                      templateHtml = templateHtml.replace('{{Betrag_netto_Grundkosten}}', body[0].Betrag_netto_Grundkosten)
                      templateHtml = templateHtml.replace('{{Umsatzsteuer_Grundkosten}}', body[0].Umsatzsteuer_Grundkosten)
                      templateHtml = templateHtml.replace('{{Steuersatz_Grundkosten}}', body[0].Steuersatz_Grundkosten)
                      templateHtml = templateHtml.replace('{{Betrag_brutto_Grundkosten}}', body[0].Betrag_brutto_Grundkosten)
                      templateHtml = templateHtml.replace('{{Position_Verbrauchskosten}}', body[0].Position_Verbrauchskosten)
                      templateHtml = templateHtml.replace('{{Erläuterung_Verbrauchskosten}}', body[0].Erläuterung_Verbrauchskosten)
                      templateHtml = templateHtml.replace('{{Betrag_netto_Verbrauchskosten}}', body[0].Betrag_netto_Verbrauchskosten)
                      templateHtml = templateHtml.replace('{{Umsatzsteuer_Verbrauchskosten}}', body[0].Umsatzsteuer_Verbrauchskosten)
                      templateHtml = templateHtml.replace('{{Steuersatz_Verbrauchskosten}}', body[0].Steuersatz_Verbrauchskosten)
                      templateHtml = templateHtml.replace('{{Betrag_brutto_Verbrauchskosten}}', body[0].Betrag_brutto_Verbrauchskosten)
                      templateHtml = templateHtml.replace('{{Position_Vorauszahlungen}}', body[0].Position_Vorauszahlungen)
                      templateHtml = templateHtml.replace('{{Erläuterung_Vorauszahlungen}}', body[0].Erläuterung_Vorauszahlungen)
                      templateHtml = templateHtml.replace('{{Betrag_netto_Vorauszahlungen}}', body[0].Betrag_netto_Vorauszahlungen)
                      templateHtml = templateHtml.replace('{{Umsatzsteuer_Vorauszahlungen}}', body[0].Umsatzsteuer_Vorauszahlungen)
                      templateHtml = templateHtml.replace('{{Steuersatz_Vorauszahlungen}}', body[0].Steuersatz_Vorauszahlungen)
                      templateHtml = templateHtml.replace('{{Betrag_brutto_Vorauszahlungen}}', body[0].Betrag_brutto_Vorauszahlungen)
                      templateHtml = templateHtml.replace('{{Position_Gebühren}}', body[0].Position_Gebühren)
                      templateHtml = templateHtml.replace('{{Erläuterung_Gebühren}}', body[0].Erläuterung_Gebühren)
                      templateHtml = templateHtml.replace('{{Betrag_netto_Gebühren}}', body[0].Betrag_netto_Gebühren)
                      templateHtml = templateHtml.replace('{{Umsatzsteuer_Gebühren}}', body[0].Umsatzsteuer_Gebühren)
                      templateHtml = templateHtml.replace('{{Steuersatz_Gebühren}}', body[0].Steuersatz_Gebühren)
                      templateHtml = templateHtml.replace('{{Betrag_brutto_Gebühren}}', body[0].Betrag_brutto_Gebühren)
                      templateHtml = templateHtml.replace('{{Position_Gutschriften}}', body[0].Position_Gutschriften)
                      templateHtml = templateHtml.replace('{{Erläuterung_Gutschriften}}', body[0].Erläuterung_Gutschriften)
                      templateHtml = templateHtml.replace('{{Betrag_netto_Gutschriften}}', body[0].Betrag_netto_Gutschriften)
                      templateHtml = templateHtml.replace('{{Umsatzsteuer_Gutschriften}}', body[0].Umsatzsteuer_Gutschriften)
                      templateHtml = templateHtml.replace('{{Steuersatz_Gutschriften}}', body[0].Steuersatz_Gutschriften)
                      templateHtml = templateHtml.replace('{{Betrag_brutto_Gutschriften}}', body[0].Betrag_brutto_Gutschriften)
                      templateHtml = templateHtml.replace('{{Position_Rabatt}}', body[0].Position_Rabatt)
                      templateHtml = templateHtml.replace('{{Erläuterung_Rabatt}}', body[0].Erläuterung_Rabatt)
                      templateHtml = templateHtml.replace('{{Betrag_netto_Rabatt}}', body[0].Betrag_netto_Rabatt)
                      templateHtml = templateHtml.replace('{{Umsatzsteuer_Rabatt}}', body[0].Umsatzsteuer_Rabatt)
                      templateHtml = templateHtml.replace('{{Steuersatz_Rabatt}}', body[0].Steuersatz_Rabatt)
                      templateHtml = templateHtml.replace('{{Betrag_brutto_Rabatt}}', body[0].Betrag_brutto_Rabatt)
                      templateHtml = templateHtml.replace('{{Position_Zahlbetrag}}', body[0].Position_Zahlbetrag)
                      templateHtml = templateHtml.replace('{{Erläuterung_Zahlbetrag}}', body[0].Erläuterung_Zahlbetrag)
                      templateHtml = templateHtml.replace('{{Betrag_netto_Zahlbetrag}}', body[0].Betrag_netto_Zahlbetrag)
                      templateHtml = templateHtml.replace('{{Umsatzsteuer_Zahlbetrag}}', body[0].Umsatzsteuer_Zahlbetrag)
                      templateHtml = templateHtml.replace('{{Steuersatz_Zahlbetrag}}', body[0].Steuersatz_Zahlbetrag)
                      templateHtml = templateHtml.replace('{{Betrag_brutto_Zahlbetrag}}', body[0].Betrag_brutto_Zahlbetrag)
                      templateHtml = templateHtml.replace('{{Verbrauch}}', body[0].Verbrauch)
                      templateHtml = templateHtml.replace('{{Energieentgelte}}', body[0].Energieentgelte)
                      templateHtml = templateHtml.replace('{{Gaspreis_Mittel_Jahr}}', body[0].Gaspreis_Mittel_Jahr)
                      templateHtml = templateHtml.replace('{{Verbrauch_je_m}}', body[0].Verbrauch_je_m)
                      templateHtml = templateHtml.replace('{{Anteil_Warmwasser}}', body[0].Anteil_Warmwasser)
                      templateHtml = templateHtml.replace('{{Verbrauch_ref}}', body[0].Verbrauch_ref)
                      templateHtml = templateHtml.replace('{{Energieentgelte_ref}}', body[0].Energieentgelte_ref)
                      templateHtml = templateHtml.replace('{{Gaspreis_Mittel_Jahr_ref}}', body[0].Gaspreis_Mittel_Jahr_ref)
                      templateHtml = templateHtml.replace('{{Verbrauch_je_m_ref}}', body[0].Verbrauch_je_m_ref)
                      templateHtml = templateHtml.replace('{{Revision}}', body[0].Revision)
                      templateHtml = templateHtml.replace('{{Queue}}', body[0].Queue)

                      var options = {
                        height: '16in',
                        width: '10in',
                        format:'A4'
                      }
                      //Genetate PDF
                      pdf.create(templateHtml, options).toFile('./invoicePDF/'+filename, function (err, pdf) {
                        if( err != null){
                          pdf_data_array.pdferror = 'Error while generating PDF.';
                          // res.json(pdf_data_array);

                        }else if(pdf.filename){
                          var updateque = {};
                          updateque.Queue= "1";
                          fetch(apiurl , {
                                method: 'PATCH',
                                headers: {
                                  'Accept': 'application/json',
                                  'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(updateque)
                            }).then(function(response) {
                              uploadpdf(filename)                  
                              pdf_data_array.success += 1;
                              // console.log("success count- "+pdf_cnt_success);
                              // res.json(pdf_data_array);
                            }).catch(error => {
                              pdf_data_array.pdferror= 'Error while update Queue.';
                            })
                        }else{
                          pdf_data_array.pdferror = 'Something went wrong in PDF.';
                          // res.json(pdf_data_array);
                        }
                      })
                  }else{
                    pdf_data_array.already += 1;
                  }
                }else{
                  pdf_data_array.pdferror = 'Record not available';
                }
            }
            response.finished = true;
        })
      }
      next();
    }, 1000)
  },function (err){
      if (err){
          console.error('Error: ' + err.message);
          return;
      }   
      res.json(pdf_data_array);
      console.log(pdf_data_array);
  });

});

// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);