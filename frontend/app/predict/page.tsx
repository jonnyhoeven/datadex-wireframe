import PredictPageClientWrapper from '../../components/PredictPageClientWrapper';
import metadata from './api/model_metadata.json';

export const metadata_page = {
    title: 'Activity Predictor - Data4OOV',
};

export default async function PredictPage() {
    // Pre-process metadata on the server
    const domeinOptions = metadata.domeinen_classes.map((d: string) => ({ value: d, label: d }));
    const allLayerOptions = metadata.layers_classes.map((l: string) => ({ value: l, label: l }));

    return (
        <PredictPageClientWrapper 
          initialDomeinOptions={domeinOptions} 
          initialLayerOptions={allLayerOptions} 
        />
    );
}
