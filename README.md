Archi diagram viewer
------------------------------

View Archimate diagrams made by https://www.archimatetool.com/

Diagrams are converted to SVG in the browser.

Todo:
* Support Text at SourceConnection
* Support alternative elements forms
* Clip element in parent by bounds parents
 

Get all ApplicationComponent + a list of ApplicationFunction linked via a AssignmentRelationship + diagrams the ApplicationComponent appears on 
 ``` javascript
my.project.Entities.filter(e => e.EntityType == 'ApplicationComponent').map(e => [e.Name, my.project.GetRelatedElementForSource(e.Id, 'AssignmentRelationship', 'ApplicationFunction').map(re => re.Name).join(', '), my.project.GetDiagramsWithElementId(e.Id).map(re => re.Name).join(', ')]).map(f => f[0] + '\t' + f[1] + '\t' + f[2].replace('CCV EA (Layered): ', '')).sort(ar => ar[3]).join('\n')

 ```
