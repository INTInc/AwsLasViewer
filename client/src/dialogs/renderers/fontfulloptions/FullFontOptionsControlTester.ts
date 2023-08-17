import {rankWith, and, schemaMatches, uiTypeIs, or, optionIs} from '@jsonforms/core';

const isFullFontOptionsControl = and(
    uiTypeIs('Control'),
    or(
        and(
            schemaMatches((schema) => schema.hasOwnProperty('visualtype')),
            schemaMatches((schema: any) => schema['visualtype'] === 'fullfontoptions')
        ),
        optionIs('fullfontoptions', true)
    )
);

export const FullFontOptionsControlTester = rankWith(6, isFullFontOptionsControl);
