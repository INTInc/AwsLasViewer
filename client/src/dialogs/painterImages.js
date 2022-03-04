import {SquarePainter} from '@int/geotoolkit/scene/shapes/painters/SquarePainter';
import {TrianglePainter} from '@int/geotoolkit/scene/shapes/painters/TrianglePainter';
import {CirclePainter} from '@int/geotoolkit/scene/shapes/painters/CirclePainter';
import {DiamondPainter} from '@int/geotoolkit/scene/shapes/painters/DiamondPainter';
import {StarPainter} from '@int/geotoolkit/scene/shapes/painters/StarPainter';
import {PlusPainter} from '@int/geotoolkit/scene/shapes/painters/PlusPainter';
import {PlusBarPainter} from '@int/geotoolkit/scene/shapes/painters/PlusBarPainter';
import {CrossPainter} from '@int/geotoolkit/scene/shapes/painters/CrossPainter';
import {SymbolShape} from '@int/geotoolkit/scene/shapes/SymbolShape';
import {Rect} from '@int/geotoolkit/util/Rect';
import {NodeExport} from '@int/geotoolkit/scene/exports/NodeExport';

const generatePainterImage = (painter) => {
    const symbol = new SymbolShape({
        'ax': 8,
        'ay': 8,
        'width': 16,
        'height': 16,
        'painter': painter,
        'linestyle': {'width': 2},
        'sizeisindevicespace': true
    });
    return NodeExport.exportToImageUrl(symbol, 24, 24, false, false, new Rect(0, 0, 16, 16));
};

export default {
    'Square': generatePainterImage(SquarePainter),
    'Triangle': generatePainterImage(TrianglePainter),
    'Circle': generatePainterImage(CirclePainter),
    'Diamond': generatePainterImage(DiamondPainter),
    'Asterisk': generatePainterImage(StarPainter),
    'Plus': generatePainterImage(PlusPainter),
    'Plus bar': generatePainterImage(PlusBarPainter),
    'Cross': generatePainterImage(CrossPainter)
};
