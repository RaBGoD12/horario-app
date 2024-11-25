import html2canvas from 'html2canvas';

export const exportTableAsImage = async (tableRef) => {
  try {
    const canvas = await html2canvas(tableRef.current, {
      scale: 2, // Mejor calidad
      backgroundColor: '#ffffff',
    });
    
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `horarios-${new Date().toLocaleDateString()}.png`;
    link.click();
  } catch (error) {
    console.error('Error al exportar la tabla:', error);
  }
};