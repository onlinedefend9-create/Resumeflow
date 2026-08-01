import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, pdf } from '@react-pdf/renderer';

export interface ExportPDFOptions {
  format?: 'a4' | 'letter';
  dpi?: 'high' | 'standard' | 'low';
  compress?: boolean;
  watermark?: {
    enabled: boolean;
    text: string;
    type: 'diagonal' | 'footer';
    color?: string;
    opacity?: number;
  };
  language?: string;
  theme?: {
    accentColor?: string;
    fontFamily?: string;
  };
  onProgress?: (progress: number, stepName: string) => void;
  cvData?: any;
}

export interface ExportPDFResult {
  blobUrl: string;
  dataUri: string;
}

// Register dynamic fonts if needed, or stick to robust standard Helvetica / Times-Roman
// Helvetica is natively supported by React-PDF without loading external resources, making it extremely fast & reliable.

const createPdfStyles = (accentColor = '#1E3A8A') => StyleSheet.create({
  page: {
    padding: 36,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1F2937',
  },
  headerContainer: {
    marginBottom: 16,
    borderBottomWidth: 1.5,
    borderBottomColor: accentColor,
    borderBottomStyle: 'solid',
    paddingBottom: 12,
  },
  fullName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: accentColor,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  jobTitle: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 4,
    fontWeight: 'medium',
  },
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 12,
  },
  contactItem: {
    fontSize: 8.5,
    color: '#6B7280',
  },
  summaryText: {
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.5,
    marginTop: 6,
    fontStyle: 'italic',
  },
  sectionContainer: {
    marginTop: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: accentColor,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 3,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  experienceItem: {
    marginBottom: 10,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  roleTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#111827',
  },
  periodText: {
    fontSize: 8.5,
    color: '#6B7280',
    fontWeight: 'medium',
  },
  companyText: {
    fontSize: 9,
    color: accentColor,
    fontWeight: 'medium',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 8.5,
    color: '#4B5563',
    lineHeight: 1.4,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  skillPill: {
    backgroundColor: '#F3F4F6',
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    fontSize: 8,
    color: '#374151',
  },
  projectItem: {
    marginBottom: 8,
  },
  projectTitle: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  watermarkFooter: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 7.5,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  watermarkDiagonalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  watermarkDiagonalText: {
    fontSize: 48,
    fontWeight: 'black',
    color: '#1E3A8A',
    opacity: 0.04,
    transform: 'rotate(-30deg)',
    textTransform: 'uppercase',
    letterSpacing: 2,
  }
});

// Document Component mapping standard CV schema to vector PDF
export const ResumePDFDocument = ({ data, accentColor, watermark }: { data: any, accentColor: string, watermark: any }) => {
  const styles = createPdfStyles(accentColor);

  // Safely extract sections from unstructured schema
  const sections = data?.sections || [];
  const header = sections.find((s: any) => s.type === 'header')?.content || {};
  const experienceSec = sections.find((s: any) => s.type === 'experience');
  const educationSec = sections.find((s: any) => s.type === 'education');
  const skillsSec = sections.find((s: any) => s.type === 'skills');
  const projectsSec = sections.find((s: any) => s.type === 'projects');

  const experiences = experienceSec?.content?.items || [];
  const educations = educationSec?.content?.items || [];
  const skills = skillsSec?.content?.skillsList || [];
  const projects = projectsSec?.content?.items || [];

  const showWatermarkFooter = watermark?.enabled && watermark?.type === 'footer';
  const showWatermarkDiagonal = watermark?.enabled && watermark?.type === 'diagonal';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Diagonal Watermark if configured */}
        {showWatermarkDiagonal && (
          <View style={styles.watermarkDiagonalContainer} pointerEvents="none">
            <Text style={styles.watermarkDiagonalText}>{watermark.text || 'CONFIDENTIEL'}</Text>
          </View>
        )}

        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.fullName}>{header.fullName || 'Nom Prénom'}</Text>
          <Text style={styles.jobTitle}>{header.title || 'Titre du poste'}</Text>

          {/* Contact details */}
          <View style={styles.contactGrid}>
            {header.email && <Text style={styles.contactItem}>✉ {header.email}</Text>}
            {header.phone && <Text style={styles.contactItem}>☎ {header.phone}</Text>}
            {header.location && <Text style={styles.contactItem}>📍 {header.location}</Text>}
            {header.website && <Text style={styles.contactItem}>🔗 {header.website}</Text>}
          </View>

          {/* Professional summary */}
          {header.summary && (
            <Text style={styles.summaryText}>{header.summary}</Text>
          )}
        </View>

        {/* Experience Section */}
        {experiences.length > 0 && (
          <View style={styles.sectionContainer} wrap={false}>
            <Text style={styles.sectionTitle}>{experienceSec?.content?.title || 'Expériences Professionnelles'}</Text>
            {experiences.map((exp: any, index: number) => (
              <View key={index} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.roleTitle}>{exp.role}</Text>
                  <Text style={styles.periodText}>{exp.period}</Text>
                </View>
                <Text style={styles.companyText}>
                  {exp.company} {exp.location ? `• ${exp.location}` : ''}
                </Text>
                <Text style={styles.itemDescription}>{exp.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Education Section */}
        {educations.length > 0 && (
          <View style={styles.sectionContainer} wrap={false}>
            <Text style={styles.sectionTitle}>{educationSec?.content?.title || 'Formation'}</Text>
            {educations.map((edu: any, index: number) => (
              <View key={index} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.roleTitle}>{edu.degree}</Text>
                  <Text style={styles.periodText}>{edu.period}</Text>
                </View>
                <Text style={styles.companyText}>
                  {edu.school} {edu.location ? `• ${edu.location}` : ''}
                </Text>
                {edu.description && (
                  <Text style={styles.itemDescription}>{edu.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Projects Section */}
        {projects.length > 0 && (
          <View style={styles.sectionContainer} wrap={false}>
            <Text style={styles.sectionTitle}>{projectsSec?.content?.title || 'Projets'}</Text>
            {projects.map((proj: any, index: number) => (
              <View key={index} style={styles.projectItem}>
                <Text style={styles.projectTitle}>{proj.name || proj.title}</Text>
                <Text style={styles.itemDescription}>{proj.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills Section */}
        {skills.length > 0 && (
          <View style={styles.sectionContainer} wrap={false}>
            <Text style={styles.sectionTitle}>{skillsSec?.content?.title || 'Compétences'}</Text>
            <View style={styles.skillsContainer}>
              {skills.map((skill: string, index: number) => (
                <Text key={index} style={styles.skillPill}>{skill}</Text>
              ))}
            </View>
          </View>
        )}

        {/* Footer Watermark if configured */}
        {showWatermarkFooter && (
          <Text style={styles.watermarkFooter}>{watermark.text || 'Généré par ResumeFlow'}</Text>
        )}
      </Page>
    </Document>
  );
};

// Main Export function
export const exportToPDF = async (
  elementId: string = 'cv-canvas',
  filename: string = 'resume.pdf',
  options: ExportPDFOptions = {}
): Promise<ExportPDFResult | null> => {
  const {
    format = 'a4',
    dpi = 'high',
    compress = true,
    watermark,
    language = 'fr',
    theme,
    onProgress,
    cvData
  } = options;

  const updateProgress = (progress: number, stepName: string) => {
    if (onProgress) {
      onProgress(progress, stepName);
    }
  };

  try {
    updateProgress(15, language === 'fr' ? 'Initialisation de l\'export...' : 'Initializing export...');
    await new Promise((r) => setTimeout(r, 100));

    updateProgress(45, language === 'fr' ? 'Compilation des styles et rubriques...' : 'Assembling styled headings...');
    await new Promise((r) => setTimeout(r, 150));

    // Dynamic color determination
    const accentColor = theme?.accentColor || '#2563eb';

    updateProgress(75, language === 'fr' ? 'Génération du document vectoriel PDF...' : 'Rendering high-fidelity vector PDF...');
    await new Promise((r) => setTimeout(r, 200));

    // Generate the PDF as a Blob using the native react-pdf engine
    const blob = await pdf(
      <ResumePDFDocument 
        data={cvData} 
        accentColor={accentColor} 
        watermark={watermark} 
      />
    ).toBlob();

    const blobUrl = URL.createObjectURL(blob);

    // Dynamic triggers for standard anchor downloads
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Convert to Data URL
    const reader = new FileReader();
    const dataUri = await new Promise<string>((resolve) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });

    updateProgress(100, language === 'fr' ? 'Terminé avec succès !' : 'Export successfully completed!');
    return { blobUrl, dataUri };

  } catch (error) {
    console.error('Error during vector PDF export:', error);
    updateProgress(100, language === 'fr' ? 'Erreur d\'export' : 'Export error');
    throw error;
  }
};
