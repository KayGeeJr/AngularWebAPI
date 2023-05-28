import { Component } from '@angular/core';
import { PackageService } from 'src/app/package.service';

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.css']
})
export class PackageComponent {

  public inputData: string | undefined;
  public data: string | undefined;

  constructor(private packageService: PackageService) {}

  ngOnInit(): void {
    this.fetchInputData();
  }

  // Fetches the input data from the service
  public fetchInputData(): void {
    this.packageService.fetchInputData().subscribe(
      (response: string) => {
        this.inputData = this.formatInputData(response);
      },
      (error: any) => {
        console.error('An error occurred while fetching the input data:', error);
      }
    );
  }

  // Fetches the output data from the service
  public fetchOutputData(): void {
    this.packageService.fetchOutputData().subscribe(
      (data) => {
        this.data = data;
      },
      (error) => {
        console.error('Error fetching output data:', error);
      }
    );
  }

  // Formats the input data to display in a desired format
  private formatInputData(data: string): string {
    // Remove square brackets
    let formattedData = data.replace(/\[|\]/g, '');

    // Start a new line after commas outside brackets
    formattedData = formattedData.replace(/,(?![^()]*\))/g, ',\n');

    // Remove quotation marks
    formattedData = formattedData.replace(/"/g, '');

    return formattedData;
  }
}
