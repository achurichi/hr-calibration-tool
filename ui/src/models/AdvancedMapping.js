class AdvancedMapping {
  imax1;
  imax2;
  max1;
  max2;
  lin_max;
  lin_min;
  parser;
  parser_param;
  function;
  other_func;

  constructor(data) {
    this.imax1 = data.imax1;
    this.imax2 = data.imax2;
    this.max1 = data.max1;
    this.max2 = data.max2;
    this.lin_max = data.lin_max;
    this.lin_min = data.lin_min;
    this.parser = data.parser;
    this.parser_param = data.parser_param;
    this.function = data.function;
    this.other_func = data.other_func;
  }
}

export default AdvancedMapping;
