
declare var jQuery : any;

export function InterfaceToClass<TInterface, TClass>(interfaceObj: TInterface, classCtr: {new (): TClass}): TClass {
    var result: TClass = <TClass>{};
    var newClassObj = new classCtr();
    jQuery.extend(newClassObj, interfaceObj);
    // Object.assign(result, newClassObj, interfaceObj);
    // return result;
    return newClassObj;
}