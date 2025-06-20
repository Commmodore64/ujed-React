import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    color: '#000',
  },
  section: {
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    marginBottom: 4,
  },
});

const TicketPDF = ({ formData }) => (
    <Document>
        <Page style={styles.page}>
            <Text style={styles.title}>Ticket de Consulta Médica</Text>
            <View style={styles.section}>
                <Text style={styles.text}>Nombre del Paciente: {formData.patientName}</Text>
                <Text style={styles.text}>Fecha y Hora de la Consulta: {formData.consultationDate}</Text>
                <Text style={styles.text}>Cantidad Pagada: ${formData.paymentAmount}</Text>
            </View>
        </Page>
    </Document>
);

const GenerarPDF = ({ formData }) => (
  <div>
    <PDFDownloadLink
      document={<TicketPDF formData={formData} />}
      fileName={`${formData.patientName}-${formData.consultationDate}-consulta.pdf`}
    >
      {({ loading }) => (loading ? 'Generando PDF...' : 'Descargar Ticket PDF')}
    </PDFDownloadLink>
  </div>
);

export default GenerarPDF;