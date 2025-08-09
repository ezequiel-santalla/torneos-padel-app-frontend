export const EnumLabelMap: Record<string, Record<string, string>> = {

  category: {
    FIRST: '1ra',
    SECOND: '2da',
    THIRD: '3ra',
    FOURTH: '4ta',
    FIFTH: '5ta',
    SIXTH: '6ta',
    SEVENTH: '7ma',
    EIGHTH: '8va',
  },

  gender: {
    MASCULINE: 'Masculino',
    FEMININE: 'Femenino',
    MIXED: 'Mixto',
  },

  matchStatus: {
    PENDING: 'Pendiente',
    COMPLETED: 'Finalizado',
  },

  tournamentStatus: {
    CREATED: 'Creado',
    IN_PROGRESS: 'En curso',
    FINISHED: 'Finalizado',
  },

  tournamentType: {
    QUADRANGULAR: 'Cuadrangular',
    KNOCKOUT: 'Eliminación directa',
    ROUND_ROBIN: 'Todos contra todos',
  },

  winningMatchRule: {
    ONE_SET_TO_5: 'Un set a 5',
    ONE_SET_TO_6: 'Un set a 6',
    ONE_SET_TO_8: 'Un set a 8',
    BEST_OF_3_SETS: 'Mejor de 3 sets',
  },
};
