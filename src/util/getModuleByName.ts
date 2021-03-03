import Clock from '../component/Clock';

const modules = {
  [Clock.name]: Clock,
};

function getModuleByName(moduleName: string) {
  return modules[moduleName];
}

export default getModuleByName;
